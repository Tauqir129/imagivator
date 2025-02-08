
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Image, Upload } from "lucide-react";
import { toast } from "sonner";

interface ImageDropzoneProps {
  onImageSelect: (files: File[]) => void;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onImageSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
      if (validFiles.length > 0) {
        onImageSelect(validFiles);
        toast.success(`${validFiles.length} image(s) uploaded successfully!`);
      } else {
        toast.error("Please upload valid image files");
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', 
        '.tiff', '.tif', '.webp', '.heif', '.heic',
        '.psd', '.exr', '.raw', '.svg', '.eps',
        '.ai', '.pdf', '.ico', '.tga', '.dds',
        '.pcx', '.xcf'
      ]
    },
    multiple: true,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`relative w-full h-64 border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-gray-300 hover:border-primary/50"
      } cursor-pointer animate-fade-in`}
    >
      <input {...getInputProps()} />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div
          className={`p-4 rounded-full bg-primary/5 transition-transform duration-200 ${
            isDragging ? "scale-110" : "scale-100"
          }`}
        >
          <Upload className="w-8 h-8 text-primary animate-float" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Drop your images here</h3>
          <p className="text-sm text-gray-500">
            Supports multiple images - JPG, PNG, GIF, WEBP, and more
          </p>
          <p className="text-xs text-gray-400">
            Drop multiple files or click to select
          </p>
        </div>
      </div>
    </div>
  );
};
