import PropertyImageGallery from "@/components/gallery/property-image-gallery";
import { Button } from "@/components/ui/button";
import DetailVenueTab from "@/components/venue/detail-venue-tab";
import ReviewsSection from "@/components/venue/ReviewsSection";
import VenueCard from "@/components/venue/VenueCard";
import { getVenueBySlug, getVenues, type Venue } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await params in Next.js 15+
  const { slug } = await params;

  // Fetch venue data - with error handling
  let venue = null;

  try {
    venue = await getVenueBySlug(slug);
  } catch (err) {
    console.error("Error loading venue:", err);
  }

  if (!venue) {
    notFound();
  }

  // Fetch other venues (excluding current one)
  let otherVenues: Venue[] = [];
  try {
    const response = await getVenues({ page: 1, limit: 4 });
    otherVenues = response.data.venues
      .filter((v) => v.id !== venue.id)
      .slice(0, 4);
  } catch (err) {
    console.error("Error loading other venues:", err);
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
            {venue.name}
          </h1>
          <p className="text-[#F8BD36] text-xl font-semibold">
            📍 {venue.city} • {venue.postalCode}
          </p>
        </div>

        {/* Elementos decorativos derecha - Responsive */}
        <div className="absolute top-16 right-4 md:top-40 md:right-20 lg:top-48 lg:right-80 w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 bg-[url('/bee-derecha.png')] bg-no-repeat bg-contain z-1 opacity-60 md:opacity-100" />
        <div className="absolute top-24 right-2 md:top-56 md:right-10 lg:top-60 lg:right-40 w-0 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-[url('/bnr-na.png')] bg-no-repeat bg-contain z-1 opacity-0 md:opacity-100" />

        {/* Fondo derecho - Responsive */}
        <div className="absolute bg-[url('/bnr-derecha.png')] bg-no-repeat bg-contain z-0 bottom-0 right-0 w-0 h-32 md:w-100 md:h-60 lg:w-135 lg:h-80 opacity-0 md:opacity-100" />
      </section>
      {/* Bloque de la Galería */}
      <div className="px-4 md:px-12 lg:px-24 xl:px-40 pt-6 md:pt-12 lg:pt-20 bg-[#FBF2E0]">
        <PropertyImageGallery images={venue.images} venueName={venue.name} />
      </div>

      {/* Bloque de los Tabs (Detalles) */}
      <div className="py-8 md:py-12 lg:py-20 px-4 md:px-12 lg:px-24 xl:px-40 bg-[#FBF2E0]">
        <DetailVenueTab venue={venue} />
      </div>

      {/* Reviews Section */}
      <ReviewsSection
        venueSlug={venue.slug}
        venueName={venue.name}
        reviews={venue.reviews || []}
      />
      {/* <div className="py-44 px-40 mx-auto flex flex-col lg:flex-row gap-12">
        
        <div className="flex flex-col lg:flex-row gap-6">
          
          <div className="flex lg:flex-col gap-4">
            {[1, 2, 3, 4].map((_, i) => (
              <Image
                key={i}
                src="/img/venue.jpg"
                alt={`Venue thumb ${i}`}
                width={80}
                height={80}
                className="border border-[#000000] transition-transform hover:scale-[1.02] cursor-pointer"
              />
            ))}
          </div>

         
          <div className="sw-[400px] h-[400px]">
            <Image
              src="/img/venue.jpg"
              alt="Main Venue"
              width={400}
              height={400}
              className="border border-[#000000] shadow-[3px_3px_0_#000000] transition-transform hover:scale-[1.02] cursor-pointer"
            />
          </div>
        </div>

        
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold">
            Altitude Trampoline Park – Katy
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-1 text-yellow-400">★★★★★</div>
            <div className="line-through ">$60.00</div>
            <div className="text-2xl font-bold">$40.00</div>
          </div>

          <p className="">
            Perfect place for kids to explore energetic activities in a safe and
            fun environment. Altitude Trampoline Park – Katy brings fun to life.
          </p>

          
          <div className="font-bold">
            Hurry up! Deal ends in:{" "}
            <span className="bg-white text-black px-2 py-1 rounded">
              300d : 18h : 35m : 50s
            </span>
          </div>

          
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              defaultValue="1"
              className="w-16 text-black px-2 py-1 rounded"
            />
            <button className="bg-[#0E2A47] text-white px-6 py-2 rounded hover:bg-[#1C3E6E]">
              Add To Cart
            </button>
          </div>

          
          <div className="mt-6">
            <Image
              src="/img/payment-methods.png"
              alt="Payments"
              width={200}
              height={30}
            />
          </div>

          
          <div className="mt-10 flex gap-4">
            <button className="bg-[#0E2A47] text-white px-4 py-2 rounded-full">
              Description
            </button>
            <button className="bg-white text-black px-4 py-2 rounded-full">
              Additional Info
            </button>
            <button className="bg-white text-black px-4 py-2 rounded-full">
              Reviews (3)
            </button>
          </div>
        </div>
      </div> */}
      {/* Other Venues Section */}
      {otherVenues.length > 0 && (
        <section className="py-10 md:py-20 px-4 md:px-12 lg:px-32 xl:px-44 bg-[#FBF2E0]">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C3658] mb-6 md:mb-8 text-center">
            Explore More Venues
          </h2>

          {/* Grid responsive: 
        - grid-cols-1: Móvil vertical (1 columna)
        - sm:grid-cols-2: Móvil horizontal / Tablet pequeña (2 columnas)
        - lg:grid-cols-4: Desktop (4 columnas)
    */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {otherVenues.map((otherVenue) => (
              <VenueCard
                key={otherVenue.id}
                venue={otherVenue}
                variant="compact"
              />
            ))}
          </div>

          <div className="text-center mt-8 md:mt-14">
            <Link href="/venues">
              {/* Botón ancho completo en móvil para facilitar el clic */}
              <Button
                variant="golden"
                size="golden"
                className="w-full sm:w-auto"
              >
                View All Venues
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
