import Image from "next/image";
import { getFeaturedVenues, type Venue } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function FeaturedVenues() {
  let featuredVenues: Venue[] = [];
  let error: string | null = null;

  try {
    featuredVenues = await getFeaturedVenues();
  } catch (err) {
    console.error("Error loading featured venues:", err);
    error = err instanceof Error ? err.message : "Failed to load venues";
  }

  // Get primary image or first image
  const getVenueImage = (venue: Venue): string => {
    const primaryImage = venue.images?.find((img) => img.isPrimary);
    return primaryImage?.url || venue.images?.[0]?.url || "/venue1.jpg";
  };

  // Get starting price from packages
  const getStartingPrice = (venue: Venue): number => {
    if (venue.startingPrice) return Number(venue.startingPrice);
    if (!venue.packages || venue.packages.length === 0) return 0;
    return Math.min(...venue.packages.map((pkg) => Number(pkg.price)));
  };

  return (
    <section className="py-20 md:py-32 lg:py-44 px-4 sm:px-6 md:px-20 lg:px-40">
      {/* Header with image and title */}
      <div className="text-center mb-12 md:mb-16 lg:mb-20">
        <div className="animate-bounce-slow">
          <Image
            src="/galeria.png"
            alt="Featured Venues"
            width={160}
            height={160}
            className="object-cover mx-auto mb-6 md:mb-8 drop-shadow-2xl w-24 h-12 md:w-32 md:h-16 lg:w-40 lg:h-20"
          />
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1C3658] mb-4 md:mb-6 tracking-tight">
          Featured Venues
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-[#1C3658]/80 max-w-2xl mx-auto leading-relaxed px-4">
          Discover our hand-picked selection of the best party venues in
          Houston. Perfect spaces for unforgettable celebrations!
        </p>
      </div>

      {error && (
        <div className="text-center py-6 md:py-8 bg-red-50 rounded-lg mb-6 md:mb-8 mx-4 md:mx-0">
          <p className="text-red-600 font-semibold text-sm md:text-base">
            Error loading featured venues
          </p>
          <p className="text-xs md:text-sm text-gray-600 mt-1">{error}</p>
        </div>
      )}

      {!error && featuredVenues.length === 0 && (
        <div className="text-center py-8 md:py-12 bg-gray-50 rounded-lg p-6 md:p-8 mb-6 md:mb-8 mx-4 md:mx-0">
          <p className="text-lg md:text-xl text-gray-800 font-semibold mb-2">
            No featured venues yet
          </p>
          <p className="text-sm md:text-base text-gray-600">
            Featured venues will appear here once they are marked as featured in
            the admin panel.
          </p>
        </div>
      )}

      {featuredVenues.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
            {featuredVenues.slice(0, 3).map((venue) => {
              const startingPrice = getStartingPrice(venue);

              return (
                <Link key={venue.id} href={`/venues/${venue.slug}`}>
                  <div className="text-center rounded-xl md:rounded-2xl border-2 border-[#000000] shadow-[3px_3px_0_#000000] md:shadow-[4px_4px_0_#000000] hover:shadow-[5px_5px_0_#000000] md:hover:shadow-[6px_6px_0_#000000] hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 cursor-pointer pb-4 md:pb-6 overflow-hidden bg-white">
                    <div className="relative overflow-hidden">
                      <Image
                        src={getVenueImage(venue)}
                        alt={venue.name}
                        width={600}
                        height={600}
                        className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="px-3 md:px-4 pt-3 md:pt-4">
                      <h3 className="text-lg md:text-xl font-semibold text-[#1C3658] mb-2">
                        {venue.name}
                      </h3>
                      <p className="text-sm md:text-base text-[#1C3658] mb-2">
                        Location: {venue.city}
                      </p>
                      {venue.specialOffer && (
                        <p className="text-sm text-gray-600 line-through mb-1">
                          ${Number(startingPrice).toFixed(2)}
                        </p>
                      )}
                      <p className="text-xl md:text-2xl text-[#1C3658] font-bold">
                        From ${Number(startingPrice).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Botón final */}
          <div className="text-center mt-10 md:mt-12 lg:mt-14 px-4">
            <Button variant="golden" size="golden" asChild className="text-sm md:text-base">
              <Link href="/venues?featured=true">Show All Venues</Link>
            </Button>
          </div>
        </>
      )}
    </section>
  );
}