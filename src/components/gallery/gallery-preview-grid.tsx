import Image from "next/image";
import { PropertyImage } from "./property-image-gallery";

interface GalleryPreviewGridProps {
  images: PropertyImage[];
  totalImages: number;
  onImageClick: (index: number) => void;
}

export default function GalleryPreviewGrid({
  images,
  totalImages,
  onImageClick,
}: GalleryPreviewGridProps) {
  const count = images.length;
  const remainingCount = Math.max(0, totalImages - 5);

  // CASO 1: Solo una imagen (Pantalla completa)
  if (count === 1) {
    return (
      <div
        className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden cursor-pointer group"
        onClick={() => onImageClick(0)}
      >
        <Image
          src={images[0]?.url || "/placeholder.jpg"}
          alt={images[0]?.description || "Main image"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority
        />
      </div>
    );
  }

  // CASO 2: Dos imágenes (50% / 50% lado a lado)
  if (count === 2) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px] md:h-[400px] w-full">
        {images.map((img, index) => (
          <div
            key={img.id}
            className="relative w-full h-full rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => onImageClick(index)}
          >
            <Image
              src={img.url}
              alt={img.description}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
    );
  }

  // CASO 3: Tres imágenes (1 Grande a la izq, 2 apiladas a la der)
  if (count === 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[500px] md:h-[400px] w-full">
        {/* Imagen Principal */}
        <div
          className="relative w-full h-64 md:h-full rounded-xl overflow-hidden cursor-pointer group"
          onClick={() => onImageClick(0)}
        >
          <Image
            src={images[0].url}
            alt={images[0].description}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>
        {/* Columna Derecha */}
        <div className="grid grid-rows-2 gap-2 h-full">
          {images.slice(1).map((img, index) => (
            <div
              key={img.id}
              className="relative w-full h-full rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => onImageClick(index + 1)}
            >
              <Image
                src={img.url}
                alt={img.description}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // CASO 4: Cuatro imágenes (Grid 2x2 simple)
  if (count === 4) {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[400px] w-full">
        {images.map((img, index) => (
          <div
            key={img.id}
            className="relative w-full h-full rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => onImageClick(index)}
          >
            <Image
              src={img.url}
              alt={img.description}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
    );
  }

  // CASO POR DEFECTO: 5+ Imágenes (El layout original estilo Bento)
  return (
    <div className="grid grid-cols-2 grid-rows-4 md:grid-cols-4 md:grid-rows-2 gap-2 h-[600px] md:h-[400px] w-full">
      {/* Imagen Principal (Grande) */}
      <div
        className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden rounded-xl group"
        onClick={() => onImageClick(0)}
      >
        <Image
          src={images[0]?.url || "/placeholder.jpg"}
          alt={images[0]?.description || "Main image"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Imágenes secundarias (Pequeñas) */}
      {images.slice(1, 5).map((img, index) => (
        <div
          key={img.id}
          className="relative cursor-pointer overflow-hidden rounded-xl group"
          onClick={() => onImageClick(index + 1)}
        >
          <Image
            src={img.url}
            alt={img.description}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {/* Overlay del contador en la última foto visible */}
          {index === 3 && remainingCount > 0 && (
            <div className="absolute inset-0 bg-black/50 hover:bg-black/40 transition-colors flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-white text-xl md:text-2xl font-bold">
                +{remainingCount}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
