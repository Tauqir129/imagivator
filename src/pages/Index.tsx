
import React, { useState } from "react";
import { ImageDropzone } from "@/components/ImageDropzone";
import { ImageProcessor } from "@/components/ImageProcessor";
import { Image } from "lucide-react";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
  };

  const handleReset = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12 animate-fade-in">
          <div className="inline-block p-3 rounded-full bg-primary/5 mb-4">
            <Image className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Image Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert, resize, and optimize your images in seconds. No upload needed -
            everything happens right in your browser.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 space-y-8 animate-fade-in">
            <ImageDropzone onImageSelect={handleImageSelect} />
            {selectedImage && (
              <ImageProcessor image={selectedImage} onReset={handleReset} />
            )}
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 text-center animate-slide-up">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary/5 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    title: "Local Processing",
    description: "All processing happens in your browser - no server uploads needed.",
    icon: <Image className="w-6 h-6 text-primary" />,
  },
  {
    title: "Multiple Formats",
    description: "Convert between PNG, JPEG, and WebP formats easily.",
    icon: <RefreshCw className="w-6 h-6 text-primary" />,
  },
  {
    title: "Preserve Quality",
    description: "Maintain image quality while optimizing file size.",
    icon: <Image className="w-6 h-6 text-primary" />,
  },
];

export default Index;
