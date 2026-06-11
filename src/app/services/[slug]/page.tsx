import PropertyImageGallery from "@/components/gallery/property-image-gallery";
import { Button } from "@/components/ui/button";
import DetailServiceTab from "../../../components/service/DetailServiceTab";
import ServiceReviewsSection from "@/components/service/ServiceReviewsSection";
import ServiceCard from "@/components/service/ServiceCard";
import { getServiceBySlug, getServices, type Service } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await params in Next.js 15+
  const { slug } = await params;

  // Fetch service data - with error handling
  let service = null;

  try {
    const response = await getServiceBySlug(slug);
    service = response.data.service;
  } catch (err) {
    console.error("Error loading service:", err);
  }

  if (!service) {
    notFound();
  }

  // Fetch other services (excluding current one)
  let otherServices: Service[] = [];
  try {
    const response = await getServices({ page: 1, limit: 4 });
    otherServices = response.data.services
      .filter((s) => s.id !== service.id)
      .slice(0, 4);
  } catch (err) {
    console.error("Error loading other services:", err);
  }

  return (
    <div className="text-[#1C3658] min-h-screen bg-gradient-to-b from-[#FBF2E0] to-white">
      <section className="bg-[#1C3658] pt-52 md:pt-56 lg:pt-64 pb-16 md:pb-20 lg:pb-28 text-center relative overflow-hidden">
        {/* Fondo izquierdo - Responsive */}
        <div className="absolute bg-[url('/bnr-izquierdo.png')] bg-no-repeat bg-contain z-0 bottom-0 left-0 w-120 h-72 md:w-100 md:h-60 lg:w-135 lg:h-80 opacity-70 md:opacity-100" />

        {/* Elementos decorativos izquierda - Responsive */}
        <div className="absolute top-16 left-4 md:top-40 md:left-20 lg:top-48 lg:left-80 w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 bg-[url('/bee-izquierda.png')] bg-no-repeat bg-contain z-1 opacity-60 md:opacity-100" />
        <div className="absolute top-24 left-2 md:top-56 md:left-10 lg:top-60 lg:left-40 w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-[url('/bnr-no.png')] bg-no-repeat bg-contain z-1 opacity-0 md:opacity-100" />

        {/* Contenido principal */}
        <div className="relative z-10 px-4 md:px-6">
          <h1 className="text-[#FBF2E0] text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold max-w-4xl mx-auto">
            {service.name}
          </h1>
          <p className="text-[#F8BD36] text-xl font-semibold">
            🎉 Mobile Party Service • Available Everywhere
          </p>
        </div>

        {/* Elementos decorativos derecha - Responsive */}
        <div className="absolute top-16 right-4 md:top-40 md:right-20 lg:top-48 lg:right-80 w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 bg-[url('/bee-derecha.png')] bg-no-repeat bg-contain z-1 opacity-60 md:opacity-100" />
        <div className="absolute top-24 right-2 md:top-56 md:right-10 lg:top-60 lg:right-40 w-0 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-[url('/bnr-na.png')] bg-no-repeat bg-contain z-1 opacity-0 md:opacity-100" />

        {/* Fondo derecho - Responsive */}
        <div className="absolute bg-[url('/bnr-derecha.png')] bg-no-repeat bg-contain z-0 bottom-0 right-0 w-0 h-32 md:w-100 md:h-60 lg:w-135 lg:h-80 opacity-0 md:opacity-100" />
      </section>

      <div className="px-4 md:px-12 lg:px-24 xl:px-40 pt-6 md:pt-12 lg:pt-20 bg-[#FBF2E0]">
        <PropertyImageGallery
          images={service.images}
          venueName={service.name}
        />
      </div>

      {/* Bloque de los Tabs (Detalles) */}
      {/* Combiné pt-20 y pb-20 en py-20 (vertical) y lo hice responsive */}
      <div className="px-4 md:px-12 lg:px-24 xl:px-40 py-8 md:py-12 lg:py-20 bg-[#FBF2E0]">
        <DetailServiceTab service={service} />
      </div>

      {/* Reviews Section */}
      <ServiceReviewsSection
        serviceSlug={service.slug}
        serviceName={service.name}
        reviews={service.reviews || []}
      />

      {/* Other Services Section */}
      {otherServices.length > 0 && (
        <section className="py-10 md:py-20 px-4 md:px-12 lg:px-32 xl:px-40 bg-[#FBF2E0]">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C3658] mb-6 md:mb-8 text-center">
            Explore More Services
          </h2>

          {/* Grid responsive: 
        - grid-cols-1: Móvil vertical
        - sm:grid-cols-2: Móvil horizontal y Tablets pequeñas
        - lg:grid-cols-4: Desktop
    */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {otherServices.map((otherService) => (
              <ServiceCard
                key={otherService.id}
                service={otherService}
                variant="compact"
              />
            ))}
          </div>

          <div className="text-center mt-8 md:mt-14">
            <Link href="/services">
              {/* Botón ancho completo en móvil para facilitar el clic */}
              <Button
                variant="golden"
                size="golden"
                className="w-full sm:w-auto"
              >
                View All Services
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
