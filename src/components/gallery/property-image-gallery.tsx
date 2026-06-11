// "Smart" Parent Component - The brain of the operation
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import GalleryPreviewGrid from "./gallery-preview-grid";
import GalleryModalContent from "./gallery-modal-content";
import type { VenueImage } from "@/lib/api";

export interface PropertyImage {
  id: string;
  url: string;
  description: string;
}

const defaultImages: PropertyImage[] = [
  {
    id: "1",
    url: "/venue-detail-image/image1.png",

    description: "Spacious living room",
  },
  {
    id: "2",
    url: "/venue-detail-image/image2.png",

    description: "Modern bathroom",
  },
  {
    id: "3",
    url: "/venue-detail-image/image3.png",

    description: "Beautiful exterior",
  },
  {
    id: "4",
    url: "/venue-detail-image/image4.png",

    description: "Cozy bedroom",
  },
  {
    id: "5",
    url: "/venue-detail-image/image5.png",

    description: "Luxurious bathroom",
  },
  {
    id: "6",
    url: "/venue-detail-image/image6.png",

    description: "Stunning exterior",
  },
  {
    id: "7",
    url: "/venue-detail-image/image-rect.jpg",

    description: "Charming attic",
  },
];

// Helper function to convert VenueImage to PropertyImage
function convertVenueImagesToPropertyImages(
  venueImages: VenueImage[]
): PropertyImage[] {
  return venueImages.map((img) => ({
    id: img.id,
    url: img.url,
    description: img.altText || "Venue image",
  }));
}

interface PropertyImageGalleryProps {
  images?: VenueImage[];
  venueName?: string;
}

export default function PropertyImageGallery({
  images,
  venueName = "Venue",
}: PropertyImageGalleryProps) {
  const propertyImages =
    images && images.length > 0
      ? convertVenueImagesToPropertyImages(images)
      : defaultImages;

  // 2. Estado centralizado mucho más limpio
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"grid" | "lightbox">("grid");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Funciones simplificadas
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setCurrentView("lightbox");
    setIsModalOpen(true);
  };

  const handleGridImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setCurrentView("lightbox");
  };

  const handleBackToGrid = () => {
    setCurrentView("grid");
  };

  // 3. Navegación directa sin filtros
  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev > 0 ? prev - 1 : propertyImages.length - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev < propertyImages.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <div className="w-full">
      <GalleryPreviewGrid
        images={propertyImages.slice(0, 5)}
        totalImages={propertyImages.length}
        onImageClick={handleImageClick}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="!h-[90vh] !w-[95vw] !max-w-[95vw] p-0 flex flex-col">
          <DialogTitle className="sr-only">
            {venueName} -{" "}
            {currentView === "grid" ? "Photo Gallery" : "Photo Viewer"}
          </DialogTitle>
          <div className="flex-1 min-h-0">
            <GalleryModalContent
              images={propertyImages}
              currentView={currentView}
              selectedImageIndex={selectedImageIndex}
              onGridImageClick={handleGridImageClick}
              onBackToGrid={handleBackToGrid}
              onPrevImage={handlePrevImage}
              onNextImage={handleNextImage}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
