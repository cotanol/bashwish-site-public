"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { VenueLocation } from "./FullMap"; 

// Importación dinámica del mapa
const FullMap = dynamic(() => import("./FullMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-2">
      <div className="w-8 h-8 border-4 border-[#1C3658] border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm font-medium">Cargando mapa...</span>
    </div>
  ),
});

interface Props {
  data: VenueLocation[];
}

export default function LocationSection({ data }: Props) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Necesario para usar createPortal solo en el cliente
  useEffect(() => {
    setMounted(true);
    
    // Bloquear scroll del body cuando el mapa está abierto
    if (isMapOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMapOpen]);

  return (
    <>
      {/* --- TARJETA PREVIEW --- */}
      <div className="bg-white border border-black shadow-[3px_3px_0_#000000] p-4 relative group">
        <h3 className="text-lg font-bold text-[#1C3658] mb-3">
          Locations
        </h3>
        
        <div className="w-full h-64 bg-gray-100 border border-black relative overflow-hidden">
          {/* Fondo estático (Preview) */}
          <div className="w-full h-full opacity-80 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none filter grayscale-[30%]">
             <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15607.56!2d-95.3698!3d29.7604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                title="Map Preview"
             />
          </div>

          {/* Botón flotante central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setIsMapOpen(true)}
              className="flex items-center gap-2 text-[#1C3658] font-semibold py-2 px-4 rounded-full border-2 border-[#000000] shadow-[2px_2px_0_#000000] bg-[#F8BD36] hover:shadow-[4px_4px_0_#000000] transition-all hover:scale-105 cursor-pointer z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
              </svg>
              View in a map
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL PANTALLA COMPLETA (Usando Portal) --- */}
      {isMapOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] bg-white animate-in fade-in duration-200">
          
          {/* Header del Modal: Posición Absoluta Arriba */}
          <div className="absolute top-0 left-0 right-0 h-16 px-6 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm z-50">
            <h2 className="font-bold text-xl text-[#1C3658]">Explorar Ubicaciones</h2>
            <button
              onClick={() => setIsMapOpen(false)}
              className="group flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
            >
              <span className="text-sm font-semibold text-gray-600 group-hover:text-black">Cerrar</span>
              <div className="bg-gray-200 text-gray-500 text-[10px] px-1.5 py-0.5 rounded font-mono hidden sm:block">ESC</div>
            </button>
          </div>

          {/* Cuerpo del Modal: Posición Absoluta llenando el resto */}
          {/* Usamos top-16 para dejar espacio al header y bottom-0 para anclarlo abajo */}
          <div className="absolute top-16 left-0 right-0 bottom-0 bg-gray-100 z-0">
            <FullMap locations={data} onClose={() => setIsMapOpen(false)} />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}