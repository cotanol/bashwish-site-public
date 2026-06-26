"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";

// Exportamos la interfaz para usarla en otros componentes
export interface VenueLocation {
  id: string | number;
  slug?: string;
  vendorId?: string;
  name: string;
  price: string;
  originalPrice?: number | null;
  discountPrice?: number | null;
  lat: number;
  lng: number;
  image: string;
  rating?: string | number;
}

// Icono personalizado con estilos Tailwind inyectados
const createPriceIcon = (price: string, isSelected: boolean) => {
  const baseClasses =
    "flex items-center justify-center px-4 py-1.5 rounded-full shadow-md border text-sm font-bold transition-all duration-200 transform whitespace-nowrap font-sans";

  const stateClasses = isSelected
    ? "bg-[#1C3658] text-white border-[#1C3658] scale-110 z-[9999]"
    : "bg-white text-[#1C3658] border-gray-200 hover:scale-110 hover:z-[1000]";

  return L.divIcon({
    className: "bg-transparent",
    html: `<div class="${baseClasses} ${stateClasses}">${price}</div>`,
    iconSize: [60, 30],
    iconAnchor: [30, 15],
  });
};

// Componente para animar el centrado del mapa
function MapUpdater({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 });
      // Invalida el tamaño para asegurar que el mapa se renderice bien al abrirse
      map.invalidateSize();
    }
  }, [center, map]);

  // Efecto extra para redibujar el mapa cuando se monta
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

interface FullMapProps {
  locations: VenueLocation[];
  onClose?: () => void;
}

const FullMap = ({ locations }: FullMapProps) => {
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const selectedLocation = locations.find(
    (l) => String(l.id) === String(selectedId),
  );

  const initialCenter: [number, number] =
    locations.length > 0
      ? [locations[0].lat, locations[0].lng]
      : [29.7604, -95.3698]; // Houston default

  return (
    <div className="relative w-full h-full bg-gray-50">
      <MapContainer
        center={initialCenter}
        zoom={13}
        className="w-full h-full outline-none z-0"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="© CARTO"
        />

        <MapUpdater
          center={
            selectedLocation
              ? [selectedLocation.lat, selectedLocation.lng]
              : null
          }
        />

        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={createPriceIcon(
              loc.price,
              String(selectedId) === String(loc.id),
            )}
            eventHandlers={{
              click: () => setSelectedId(loc.id),
            }}
          />
        ))}
      </MapContainer>

      {/* Tarjeta flotante de detalle */}
      {selectedLocation && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white rounded-2xl shadow-2xl z-[1000] overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedId(null);
            }}
            className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full text-gray-600 hover:text-black hover:bg-white transition-colors z-20 shadow-sm backdrop-blur-sm hover:cursor-pointer"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="relative h-48 w-full bg-gray-200">
            <Image
              src={selectedLocation.image}
              alt={selectedLocation.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm text-[#1C3658]">
              🎉 Venue
            </div>
          </div>

          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[#1C3658] text-lg leading-tight line-clamp-1">
                {selectedLocation.name}
              </h3>
              {selectedLocation.rating && (
                <div className="flex items-center gap-1 text-sm font-semibold">
                  <span className="text-[#F8BD36]">★</span>
                  <span className="text-gray-700">
                    {selectedLocation.rating}
                  </span>
                </div>
              )}
            </div>

            <p className="text-gray-500 text-sm mb-4">
              Party venue with packages for kids birthdays and events
            </p>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <div className="flex flex-col">
                {selectedLocation.discountPrice ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-[#F8BD36]">
                        ${selectedLocation.discountPrice}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ${selectedLocation.originalPrice}
                      </span>
                    </div>
                    <span className="text-xs text-[#F8BD36] font-medium">
                      💰 DEMO Special
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-xl font-bold text-[#1C3658]">
                      {selectedLocation.price}
                    </span>
                    <span className="text-xs text-gray-400">starting from</span>
                  </>
                )}
              </div>
              {selectedLocation.slug ? (
                <a
                  href={`/venues/${selectedLocation.slug}`}
                  className="bg-[#1C3658] hover:bg-[#162a45] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Track click if vendorId exists
                    if (selectedLocation.vendorId) {
                      // TODO: Implement click tracking
                    }
                  }}
                >
                  Ver Detalles
                </a>
              ) : (
                <button className="bg-gray-400 text-white text-sm font-medium px-5 py-2.5 rounded-lg cursor-not-allowed">
                  No disponible
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullMap;
