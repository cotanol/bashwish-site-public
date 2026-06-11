// "Smart-Intermediate" Child Component - Logic inside the modal
import Image from "next/image";
import { PropertyImage } from "./property-image-gallery";
import GalleryLightboxView from "./gallery-lightbox-view";

interface GalleryModalContentProps {
  images: PropertyImage[];
  currentView: "grid" | "lightbox";
  selectedImageIndex: number;
  onGridImageClick: (index: number) => void;
  onBackToGrid: () => void;
  onPrevImage: () => void;
  onNextImage: () => void;
}

export default function GalleryModalContent({
  images,
  currentView,
  selectedImageIndex,
  onGridImageClick,
  onBackToGrid,
  onPrevImage,
  onNextImage,
}: GalleryModalContentProps) {
  // Grid view simple (sin header de filtros)
  const GridView = () => {
    return (
      <div className="flex flex-col h-full">
        {/* Título opcional o simplemente padding arriba */}
        <div className="p-6 pb-2 border-b bg-white">
          <h2 className="text-lg font-semibold">All ({images.length})</h2>
        </div>

        {/* Grid de imágenes - Área con scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="aspect-square relative cursor-pointer overflow-hidden rounded-lg group bg-gray-100"
                onClick={() => onGridImageClick(index)}
              >
                <Image
                  src={img.url}
                  alt={img.description}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {currentView === "grid" ? (
        <GridView />
      ) : (
        <GalleryLightboxView
          images={images}
          selectedImageIndex={selectedImageIndex}
          onBackToGrid={onBackToGrid}
          onPrevImage={onPrevImage}
          onNextImage={onNextImage}
        />
      )}
    </>
  );
}
