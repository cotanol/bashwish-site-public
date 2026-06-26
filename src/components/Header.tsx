// src/components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b-2 border-[#000000] shadow-lg">
      {/* Barra superior de contacto */}
      <div className="bg-gradient-to-r from-[#F8BD36] via-[#fac658] to-[#F8BD36] text-[#1C3658] text-sm px-4 sm:px-6 md:px-12 lg:px-40 py-3 md:py-4 flex items-center justify-center">
        <div className="flex items-center space-x-3 md:space-x-4">
          <a
            href="#"
            aria-label="Instagram"
            className="hover:scale-110 transition-transform"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/instagram.svg"
              alt="Instagram"
              className="h-4 w-4 md:h-5 md:w-5"
            />
          </a>
          <a
            href="#"
            aria-label="Facebook"
            className="hover:scale-110 transition-transform"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/facebook.svg"
              alt="Facebook"
              className="h-4 w-4 md:h-5 md:w-5"
            />
          </a>
          <a
            href="#"
            aria-label="YouTube"
            className="hover:scale-110 transition-transform"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/youtube.svg"
              alt="YouTube"
              className="h-4 w-4 md:h-5 md:w-5"
            />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="hover:scale-110 transition-transform"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/twitter.svg"
              alt="Twitter"
              className="h-4 w-4 md:h-5 md:w-5"
            />
          </a>
        </div>
      </div>

      {/* Navegación principal */}
      <nav className="bg-[#FBF2E0] px-4 sm:px-6 md:px-12 lg:px-40 py-2">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-cortado.png"
              alt="DEMO"
              className="h-12 w-auto md:h-16"
            />
          </Link>

          {/* Navegación principal - Desktop */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              href="/"
              className="text-[#1C3658] font-semibold hover:text-[#F8BD36] transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-[#F8BD36]/10 text-sm lg:text-base"
            >
              Home
            </Link>

            <Link
              href="/venues"
              className="text-[#1C3658] font-semibold hover:text-[#F8BD36] transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-[#F8BD36]/10 text-sm lg:text-base"
            >
              Venues
            </Link>

            <Link
              href="/services"
              className="text-[#1C3658] font-semibold hover:text-[#F8BD36] transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-[#F8BD36]/10 text-sm lg:text-base"
            >
              Services
            </Link>

            {/* Botón For Vendors */}
            <Link
              href="/claim-venue"
              className="bg-[#F8BD36] text-[#1C3658] font-semibold px-4 py-2 rounded-full border-2 border-[#000000] shadow-[2px_2px_0_#000000] hover:shadow-[4px_4px_0_#000000] hover:bg-[#f7a600] transition-all text-center text-sm lg:text-base"
            >
              For Vendors
            </Link>
          </div>

          {/* Menú móvil */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#1C3658] font-semibold py-2 px-4 rounded-lg border-2 border-[#000000] shadow-[2px_2px_0_#000000] bg-[#F8BD36] hover:shadow-[4px_4px_0_#000000] transition-all hover:cursor-pointer"
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#FBF2E0] shadow-[0_2px_2px_#000000]">
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/"
                className="block text-[#1C3658] font-bold text-lg px-4 py-4 rounded-xl border-2 border-[#000000] shadow-[2px_2px_0_#000000] bg-white hover:bg-[#F8BD36] hover:shadow-[4px_4px_0_#000000] hover:-translate-y-1 transition-all duration-300 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center justify-between">
                  Home
                  <span className="text-[#1C3658] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    →
                  </span>
                </span>
              </Link>

              <Link
                href="/venues"
                className="block text-[#1C3658] font-bold text-lg px-4 py-4 rounded-xl border-2 border-[#000000] shadow-[2px_2px_0_#000000] bg-white hover:bg-[#F8BD36] hover:shadow-[4px_4px_0_#000000] hover:-translate-y-1 transition-all duration-300 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center justify-between">
                  Venues
                  <span className="text-[#1C3658] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    →
                  </span>
                </span>
              </Link>

              <Link
                href="/services"
                className="block text-[#1C3658] font-bold text-lg px-4 py-4 rounded-xl border-2 border-[#000000] shadow-[2px_2px_0_#000000] bg-white hover:bg-[#F8BD36] hover:shadow-[4px_4px_0_#000000] hover:-translate-y-1 transition-all duration-300 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center justify-between">
                  Services
                  <span className="text-[#1C3658] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    →
                  </span>
                </span>
              </Link>

              <Link
                href="/claim-venue"
                className="block bg-[#F8BD36] text-[#1C3658] font-bold text-lg px-4 py-3 rounded-full border-2 border-[#000000] shadow-[2px_2px_0_#000000] hover:shadow-[4px_4px_0_#000000] hover:bg-[#f7a600] transition-all text-center mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                For Vendors
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
