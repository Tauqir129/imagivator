
import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Image } from "lucide-react";
import { toast } from "sonner";

interface ImageProcessorProps {
  image: File;
  onReset: () => void;
}

export const ImageProcessor: React.FC<ImageProcessorProps> = ({
  image,
  onReset,
}) => {
  const [format, setFormat] = useState("png");
  const [quality, setQuality] = useState(90);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleFormatChange = (value: string) => {
    setFormat(value);
  };

  const handleQualityChange = (value: number[]) => {
    setQuality(value[0]);
  };

  const processImage = async () => {
    if (!image) return;

    setProcessing(true);
    try {
      const img = new Image();
      const originalUrl = URL.createObjectURL(image);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const targetWidth = width || img.width;
        const targetHeight = height || img.height;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `converted-image.${format}`;
              link.click();
              URL.revokeObjectURL(url);
              toast.success("Image processed and downloaded successfully!");
            }
            setProcessing(false);
          },
          `image/${format}`,
          quality / 100
        );

        URL.revokeObjectURL(originalUrl);
      };

      img.src = originalUrl;
    } catch (error) {
      toast.error("Error processing image");
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up bg-gray-50 rounded-lg p-6">
      <div className="flex items-start gap-6">
        <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{image.name}</span>
            <span className="text-xs text-gray-500">
              {(image.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Output Format</label>
              <Select value={format} onValueChange={handleFormatChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                  <SelectItem value="gif">GIF</SelectItem>
                  <SelectItem value="bmp">BMP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quality ({quality}%)</label>
              <Slider
                value={[quality]}
                onValueChange={handleQualityChange}
                min={1}
                max={100}
                step={1}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Width (px)</label>
                <input
                  type="number"
                  value={width || ""}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  placeholder="Original"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Height (px)</label>
                <input
                  type="number"
                  value={height || ""}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  placeholder="Original"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={processImage}
              disabled={processing}
              className="flex-1"
            >
              {processing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {processing ? "Processing..." : "Download"}
            </Button>
            <Button variant="outline" onClick={onReset}>
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
