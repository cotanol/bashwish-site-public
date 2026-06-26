import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-sm relative">
      {/* 🌥️ Imagen decorativa superior */}
      <div className="w-full bg-[#FBF2E0]">
        <Image
          src="/ft-nube.png"
          alt="Decorative Clouds"
          width={1920}
          height={234}
          className="w-full h-auto"
        />
      </div>

      {/* 🟦 Contenido principal del footer */}
      <div className="bg-[#1C3658] mt-[-1px] text-[#FBF2E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-40 lg:px-0 py-8 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
          {/* Logo + contacto - Ocupa toda la fila en mobile, luego se ajusta */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <div className="flex justify-center sm:justify-start items-center gap-2">
              <Image
                src="/logo-f.png"
                alt="Titoo Logo"
                width={120}
                height={120}
                className="w-32 sm:w-36 lg:w-40"
              />
            </div>
            <p className="text-sm sm:text-base">
              Houston
              <br />
              Texas, Estados Unidos
            </p>
            <p className="text-sm sm:text-base">Call Us: +31 (0) 123 456 789</p>
            <p className="text-sm sm:text-base">hello@DEMO.com</p>
          </div>

          {/* Imágenes izquierda - Se mueve después de Useful Links en mobile */}
          <div className="order-3 sm:order-2 flex justify-center sm:justify-start gap-4 sm:block">
            <Image
              src="/ft-izquierda.png"
              alt="Titoo Logo"
              width={80}
              height={80}
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
            />
            <Image
              src="/ft-izquierda-2.png"
              className="mt-2 sm:mt-4 ml-4 sm:ml-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
              alt="Titoo Logo"
              width={80}
              height={80}
            />
          </div>

          {/* Useful Links - Va después del logo en mobile */}
          <div className="order-2 sm:order-3 text-center sm:text-left">
            <h3 className="font-semibold mb-3 text-base sm:text-lg">
              Useful Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#F8BD36] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/venues"
                  className="hover:text-[#F8BD36] transition-colors"
                >
                  Venues
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-[#F8BD36] transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/claim-venue"
                  className="hover:text-[#F8BD36] transition-colors"
                >
                  For Vendors
                </Link>
              </li>
            </ul>
          </div>

          {/* Imágenes derecha - Se mantiene en su posición */}
          <div className="order-4 flex justify-center sm:justify-start gap-4 sm:block">
            <Image
              src="/ft-derecha.png"
              alt="Titoo Logo"
              width={80}
              height={80}
              className="w-16 h-6 sm:w-20 sm:h-10 lg:w-24 lg:h-14"
            />
            <Image
              src="/ft-derecha-2.png"
              className="mt-2 sm:mt-4 ml-4 sm:ml-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
              alt="Titoo Logo"
              width={80}
              height={80}
            />
          </div>

          {/* Need Help - Va al final en mobile */}
          <div className="order-5 text-center sm:text-left">
            <h3 className="font-semibold mb-3 text-base sm:text-lg">
              Need Help
            </h3>
            <p className="mb-2 text-sm sm:text-base">
              +123 - 589 - 45895
              <br />
              +123 - 589 - 45264
            </p>
            <p className="mb-2 text-sm sm:text-base">
              Monday - Friday: 9am - 6pm
            </p>
            <p className="text-sm sm:text-base">
              Saturday: 9am - 3pm
              <br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>

      {/* 👤 Imagen decorativa sobrepuesta */}
      <div className="bg-[#F8BC36] text-[#1C3658] py-2 relative z-10">
        <div className="absolute -top-[35px] sm:-top-[45px] left-0 z-20">
          <Image
            src="/ft-izquierdo.png"
            alt="Personaje decorativo"
            width={160}
            height={80}
            className="object-contain w-40 sm:w-48 lg:w-56"
          />
        </div>
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm sm:text-base text-center md:text-left">
            Copyright @2025. All Right Reserved by DEMO.
          </p>
        </div>
      </div>
    </footer>
  );
}
