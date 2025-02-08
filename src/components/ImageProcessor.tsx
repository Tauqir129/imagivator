
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ImageProcessorProps {
  image: File | null;
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

        // Draw image with smooth interpolation
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
    <div className="space-y-6 animate-slide-up">
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
          disabled={!image || processing}
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
          Reset
        </Button>
      </div>
    </div>
  );
};
