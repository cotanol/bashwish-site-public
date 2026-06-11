import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { type Venue } from "@/lib/api";
import TrackableLink from "../common/TrackableLink";

interface VenueCardProps {
  venue: Venue;
  variant?: "default" | "compact";
}

export default function VenueCard({
  venue,
  variant = "default",
}: VenueCardProps) {
  // Get primary image or fallback to default
  const primaryImage =
    venue.images?.find((img) => img.isPrimary)?.url ||
    venue.images?.[0]?.url ||
    "/venue1.jpg"; // Default fallback image

  // Check if venue has a discount or any package has a discount
  const hasDiscount = (venue.discountPrice && venue.discountPrice < (venue.startingPrice || 0)) || 
                      venue.packages?.some(pkg => pkg.discountPrice && pkg.discountPrice < pkg.price);

  if (variant === "compact") {
    return (
      <div className="bg-white rounded-2xl border-2 border-[#000000] shadow-[4px_4px_0_#000000] overflow-hidden hover:shadow-[6px_6px_0_#000000] hover:-translate-y-1 transition-all duration-300">
        <div className="relative h-48">
          <Image
            src={primaryImage}
            alt={venue.name}
            fill
            className="object-cover"
          />
          {venue.isFeatured && (
            <span className="absolute top-3 left-3 bg-[#F8BD36] text-[#0E2A47] text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
              ⭐ Featured
            </span>
          )}
          {hasDiscount && (
            <span className="absolute top-3 right-3 bg-[#FF6B6B] text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
              💰 BashWish Discount
            </span>
          )}
          {venue.specialOffer && (
            <span className="absolute bottom-3 left-3 bg-[#0E2A47] text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
              {venue.specialOffer}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-[#1C3658] mb-2 line-clamp-1">
            {venue.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">📍 {venue.city}</p>
          {venue.startingPrice && (
            <div className="mb-3">
              {(() => {
                // Check venue discount first
                if (venue.discountPrice && venue.discountPrice < venue.startingPrice) {
                  return (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-400 line-through">
                        ${venue.startingPrice}
                      </span>
                      <span className="text-lg font-bold text-[#FF6B6B]">
                        ${venue.discountPrice}
                      </span>
                    </div>
                  );
                }
                
                // Otherwise check package discounts
                const lowestDiscount = venue.packages
                  ?.filter(pkg => pkg.discountPrice)
                  .map(pkg => Number(pkg.discountPrice))
                  .sort((a, b) => a - b)[0];
                
                if (lowestDiscount && lowestDiscount < Number(venue.startingPrice)) {
                  return (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-400 line-through">
                        ${venue.startingPrice}
                      </span>
                      <span className="text-lg font-bold text-[#FF6B6B]">
                        ${lowestDiscount}
                      </span>
                    </div>
                  );
                }
                return (
                  <p className="text-lg font-bold text-green-600">
                    From ${venue.startingPrice}
                  </p>
                );
              })()}
            </div>
          )}
          <Link href={`/venues/${venue.slug}`} className="w-full">
            <Button className="w-full bg-[#F8BD36] text-[#1C3658] hover:bg-[#F8BD36]/90">
              More info
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Default variant (full card as in venues page)
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-6 bg-white rounded-2xl border-2 border-[#000000] shadow-[4px_4px_0_#000000] hover:shadow-[6px_6px_0_#000000] hover:-translate-y-1 transition-all duration-300 p-6 h-auto">
  {/* Image Container - Fixed width, full height */}
  <div className="relative w-full sm:w-[320px] flex-shrink-0 rounded-xl overflow-hidden">
    <Link href={`/venues/${venue.slug}`} className="block w-full h-full cursor-pointer">
          <Image
            src={primaryImage}
            alt={venue.name}
            className="rounded-lg object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            width={400}
            height={400}
          />
        </Link>
    {venue.isFeatured && (
      <span className="absolute top-3 left-3 bg-[#F8BD36] text-[#0E2A47] text-sm px-4 py-2 rounded-full font-bold shadow-lg">
        ⭐ Featured
      </span>
    )}
    {hasDiscount && (
      <span className="absolute top-3 right-3 bg-[#FF6B6B] text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg">
        💰 BashWish Discount
      </span>
    )}
    {venue.specialOffer && (
      <span className="absolute bottom-3 left-3 bg-[#0E2A47] text-white text-xs px-4 py-2 rounded-full font-bold shadow-lg">
        {venue.specialOffer}
      </span>
    )}
  </div>

  {/* Content Container - Flexible, scrollable if needed */}
  <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
    <Link href={`/venues/${venue.slug}`} className="w-fit">
          <h2 className="text-2xl font-bold text-[#1C3658] mb-2 line-clamp-1 hover:text-[#F8BD36] transition-colors cursor-pointer">
            {venue.name}
          </h2>
        </Link>
    <ul className="text-sm mt-1 space-y-1 flex-shrink-0">
      <li className="text-gray-700">
        📍 {venue.city} {venue.postalCode}
      </li>
      {venue.packages && venue.packages.length > 0 && (
        <>
          {/* Show unique themes from all packages */}
          {(() => {
            const allThemes = venue.packages
              .flatMap((pkg) => pkg.themes || [])
              .map((t) => t.theme.name);
            const uniqueThemes = [...new Set(allThemes)];
            return uniqueThemes.length > 0 ? (
              <li className="text-gray-700">
                🎨 Themes: {uniqueThemes.slice(0, 3).join(", ")}
                {uniqueThemes.length > 3 &&
                  ` +${uniqueThemes.length - 3} more`}
              </li>
            ) : null;
          })()}
          {/* Show age range from packages */}
          {(() => {
            const ages = venue.packages.map((pkg) => ({
              min: pkg.ageMin,
              max: pkg.ageMax,
            }));
            const minAge = Math.min(...ages.map((a) => a.min));
            const maxAge = Math.max(...ages.map((a) => a.max));
            return (
              <li className="text-gray-700">
                👶 Ages: {minAge}-{maxAge} years
              </li>
            );
          })()}
          {/* Show capacity range from packages */}
          {(() => {
            const capacities = venue.packages.map((pkg) => ({
              min: pkg.minKids,
              max: pkg.maxKids,
            }));
            const minKids = Math.min(...capacities.map((c) => c.min));
            const maxKids = Math.max(...capacities.map((c) => c.max));
            return (
              <li className="text-gray-700">
                👥 Capacity: {minKids}-{maxKids} kids
              </li>
            );
          })()}
        </>
      )}
      {venue.startingPrice && (
        <li className="mt-2">
          {(() => {
            // Check venue discount first
            if (venue.discountPrice && venue.discountPrice < venue.startingPrice) {
              return (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-400 line-through">
                    ${venue.startingPrice}
                  </span>
                  <span className="text-xl font-bold text-[#FF6B6B]">
                    ${venue.discountPrice}
                  </span>
                </div>
              );
            }
            
            // Otherwise find the lowest package discountPrice if available
            const lowestDiscount = venue.packages
              ?.filter(pkg => pkg.discountPrice)
              .map(pkg => Number(pkg.discountPrice))
              .sort((a, b) => a - b)[0];
            
            if (lowestDiscount && lowestDiscount < Number(venue.startingPrice)) {
              return (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-400 line-through">
                    ${venue.startingPrice}
                  </span>
                  <span className="text-xl font-bold text-[#FF6B6B]">
                    ${lowestDiscount}
                  </span>
                </div>
              );
            }
            return (
              <span className="text-xl font-bold text-green-600">
                From ${venue.startingPrice}
              </span>
            );
          })()}
        </li>
      )}
    </ul>
    <p className="text-sm mt-2 line-clamp-2 text-gray-600 flex-shrink-0">
      {venue.description ||
        "Perfect for young adventurers, this venue brings fun experiences to families."}
    </p>

    {/* Buttons Container - Always at bottom */}
    <div className="flex gap-3 mt-auto pt-3">
      <Link href={`/venues/${venue.slug}`} className="flex-1">
        <Button className="w-full bg-[#F8BD36] text-[#1C3658] hover:bg-[#F8BD36]/90 cursor-pointer">
          More info
        </Button>
      </Link>
      {venue.website && (
        <TrackableLink
          href={venue.website}
          targetId={venue.id}
          targetType="VENUE"
          vendorId={venue.vendorId}
          className="flex-1"
        >
          <Button className="w-full bg-[#F8BD36] text-[#1C3658] hover:bg-[#F8BD36]/90 cursor-pointer">
            Reserve Venue
          </Button>
        </TrackableLink>
      )}
    </div>
  </div>
</div>

  );
}
