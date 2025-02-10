
document.addEventListener('DOMContentLoaded', () => {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const imageProcessors = document.getElementById('imageProcessors');
  let selectedImages = [];

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.getElementById('toaster').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  function handleDrop(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length > 0) {
      selectedImages = [...selectedImages, ...validFiles];
      showToast(`${validFiles.length} image(s) uploaded successfully!`);
      updateImageProcessors();
    } else {
      showToast('Please upload valid image files', 'error');
    }
  }

  function createImageProcessor(image, index) {
    const processor = document.createElement('div');
    processor.className = 'space-y-6 animate-slide-up bg-gray-50 rounded-lg p-6';
    
    const preview = URL.createObjectURL(image);
    
    processor.innerHTML = `
      <div class="flex items-start gap-6">
        <div class="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <img src="${preview}" alt="Preview" class="w-full h-full object-cover">
        </div>
        
        <div class="flex-1 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">${image.name}</span>
            <span class="text-xs text-gray-500">${(image.size / (1024 * 1024)).toFixed(2)} MB</span>
          </div>

          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Output Format</label>
              <select class="format-select w-full px-3 py-2 border rounded-md">
                <option value="jpeg">JPEG/JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
                <option value="gif">GIF</option>
                <option value="bmp">BMP</option>
                <option value="tiff">TIFF/TIF</option>
                <option value="heif">HEIF/HEIC</option>
                <option value="psd">PSD</option>
                <option value="exr">EXR</option>
                <option value="raw">RAW</option>
                <option value="svg">SVG</option>
                <option value="eps">EPS</option>
                <option value="ai">AI</option>
                <option value="pdf">PDF</option>
                <option value="ico">ICO</option>
                <option value="tga">TGA</option>
                <option value="dds">DDS</option>
                <option value="pcx">PCX</option>
                <option value="xcf">XCF</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Quality (90%)</label>
              <input type="range" class="quality-slider w-full" min="1" max="100" value="90">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Width (px)</label>
                <input type="number" class="width-input w-full px-3 py-2 border rounded-md" placeholder="Original">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Height (px)</label>
                <input type="number" class="height-input w-full px-3 py-2 border rounded-md" placeholder="Original">
              </div>
            </div>
          </div>

          <div class="flex gap-4">
            <button class="process-btn flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              Download
            </button>
            <button class="remove-btn px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Remove
            </button>
          </div>
        </div>
      </div>
    `;

    const formatSelect = processor.querySelector('.format-select');
    formatSelect.addEventListener('change', (e) => {
      const unsupportedFormats = ["tiff", "heif", "psd", "exr", "raw", "eps", "ai", "pdf", "tga", "dds", "pcx", "xcf"];
      if (unsupportedFormats.includes(e.target.value)) {
        showToast("This format may not be supported in all browsers", 'warning');
      }
    });

    processor.querySelector('.process-btn').addEventListener('click', async () => {
      const format = formatSelect.value;
      const quality = processor.querySelector('.quality-slider').value;
      const width = processor.querySelector('.width-input').value;
      const height = processor.querySelector('.height-input').value;
      
      try {
        await processImage(image, format, quality, width, height);
      } catch (error) {
        showToast(error.message, 'error');
      }
    });

    processor.querySelector('.remove-btn').addEventListener('click', () => {
      selectedImages.splice(index, 1);
      updateImageProcessors();
    });

    return processor;
  }

  async function processImage(image, format, quality, width, height) {
    const img = new Image();
    img.src = URL.createObjectURL(image);
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width || img.width;
    canvas.height = height || img.height;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (format === 'svg') {
      try {
        const svgData = `
          <svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">
            <image width="${canvas.width}" height="${canvas.height}" href="${canvas.toDataURL('image/png')}" />
          </svg>
        `;
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        downloadBlob(blob, `converted-image.svg`);
        showToast("Image converted to SVG successfully!");
      } catch (error) {
        throw new Error("Error converting to SVG");
      }
      return;
    }

    canvas.toBlob(
      (blob) => {
        if (blob) {
          downloadBlob(blob, `converted-image.${format}`);
          showToast("Image processed and downloaded successfully!");
        } else {
          throw new Error("Error processing image");
        }
      },
      `image/${format}`,
      quality / 100
    );
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function updateImageProcessors() {
    imageProcessors.innerHTML = '';
    selectedImages.forEach((image, index) => {
      imageProcessors.appendChild(createImageProcessor(image, index));
    });
  }

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('border-purple-500', 'bg-purple-50');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('border-purple-500', 'bg-purple-50');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('border-purple-500', 'bg-purple-50');
    handleDrop(e);
  });

  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleDrop);
});
