// "Dumb" Child Component - Full screen carousel
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft } from "lucide-react";
import { PropertyImage } from "./property-image-gallery";

interface GalleryLightboxViewProps {
  images: PropertyImage[];
  selectedImageIndex: number;
  onBackToGrid: () => void;
  onPrevImage: () => void;
  onNextImage: () => void;
}

export default function GalleryLightboxView({
  images,
  selectedImageIndex,
  onBackToGrid,
  onPrevImage,
  onNextImage,
}: GalleryLightboxViewProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(selectedImageIndex);

  // Synchronize carousel with selected index on mount or when it changes
  useEffect(() => {
    if (api && selectedImageIndex !== currentIndex) {
      api.scrollTo(selectedImageIndex);
      setCurrentIndex(selectedImageIndex);
    }
  }, [api, selectedImageIndex, currentIndex]);

  // Listen to carousel changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="h-full flex flex-col">
      {/* Header con botón de volver */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <Button
          variant="ghost"
          onClick={onBackToGrid}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to gallery
        </Button>
        <span className="text-sm text-gray-500">
          {currentIndex + 1} of {images.length}
        </span>
      </div>

      {/* Carousel - área principal con flex-1 */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Carousel
          setApi={setApi}
          className="w-full max-w-6xl"
          opts={{ startIndex: selectedImageIndex }}
        >
          <CarouselContent>
            {images.map((img, index) => (
              <CarouselItem key={img.id}>
                <div className="relative aspect-video w-full">
                  <Image
                    src={img.url}
                    alt={img.description}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority={index === selectedImageIndex}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" onClick={onPrevImage} />
          <CarouselNext className="right-4" onClick={onNextImage} />
        </Carousel>
      </div>

      {/* Footer con descripción */}
      <div className="p-4 border-t bg-white">
        <p className="text-center text-gray-600">
          {images[currentIndex]?.description || "No description available"}
        </p>
      </div>
    </div>
  );
}
