import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { type Service } from "@/lib/api";
import TrackableLink from "../common/TrackableLink";

interface ServiceCardProps {
  service: Service;
  variant?: "default" | "compact";
}

export default function ServiceCard({
  service,
  variant = "default",
}: ServiceCardProps) {
  // Get primary image or fallback to default
  const primaryImage =
    service.images?.find((img) => img.isPrimary)?.url ||
    service.images?.[0]?.url ||
    "/party-genie.png"; // Default fallback image

  // Check if service has a discount or any package has a discount
  const hasDiscount =
    (service.discountPrice &&
      service.discountPrice < (service.startingPrice || 0)) ||
    service.packages?.some(
      (pkg) => pkg.discountPrice && pkg.discountPrice < pkg.price,
    );

  if (variant === "compact") {
    return (
      <div className="bg-white rounded-2xl border-2 border-[#000000] shadow-[4px_4px_0_#000000] overflow-hidden hover:shadow-[6px_6px_0_#000000] hover:-translate-y-1 transition-all duration-300">
        <div className="relative h-48">
          <Image
            src={primaryImage}
            alt={service.name}
            fill
            className="object-cover"
          />
          {service.isFeatured && (
            <span className="absolute top-3 left-3 bg-[#F8BD36] text-[#0E2A47] text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
              ⭐ Featured
            </span>
          )}
          {hasDiscount && (
            <span className="absolute top-3 right-3 bg-[#FF6B6B] text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
              💰 DEMO Discount
            </span>
          )}
          {service.specialOffer && (
            <span className="absolute bottom-3 left-3 bg-[#0E2A47] text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
              {service.specialOffer}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-[#1C3658] mb-2 line-clamp-1">
            {service.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {service.description || "Professional party service"}
          </p>
          {service.startingPrice && (
            <div className="mb-3">
              {(() => {
                // Check service discount first
                if (
                  service.discountPrice &&
                  service.discountPrice < service.startingPrice
                ) {
                  return (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-400 line-through">
                        ${service.startingPrice}
                      </span>
                      <span className="text-lg font-bold text-[#FF6B6B]">
                        ${service.discountPrice}
                      </span>
                    </div>
                  );
                }

                // Otherwise check package discounts
                const lowestDiscount = service.packages
                  ?.filter((pkg) => pkg.discountPrice)
                  .map((pkg) => Number(pkg.discountPrice))
                  .sort((a, b) => a - b)[0];

                if (
                  lowestDiscount &&
                  lowestDiscount < Number(service.startingPrice)
                ) {
                  return (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-400 line-through">
                        ${service.startingPrice}
                      </span>
                      <span className="text-lg font-bold text-[#FF6B6B]">
                        ${lowestDiscount}
                      </span>
                    </div>
                  );
                }
                return (
                  <p className="text-lg font-bold text-green-600">
                    From ${service.startingPrice}
                  </p>
                );
              })()}
            </div>
          )}
          <div className="flex gap-2">
            <Link href={`/services/${service.slug}`} className="flex-1">
              <Button
                variant="golden"
                size="golden"
                className="w-full cursor-pointer"
              >
                More info
              </Button>
            </Link>
            {service.website && (
              <TrackableLink
                href={service.website}
                targetId={service.id}
                targetType="SERVICE"
                className="flex-1"
              >
                <Button
                  variant="golden"
                  size="golden"
                  className="w-full cursor-pointer"
                >
                  Reserve Service
                </Button>
              </TrackableLink>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant (full card as in services page)
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-6 bg-white rounded-2xl border-2 border-[#000000] shadow-[4px_4px_0_#000000] hover:shadow-[6px_6px_0_#000000] hover:-translate-y-1 transition-all duration-300 p-6 h-auto">
      {/* Image Container - Fixed width, full height */}
      <div className="relative w-full sm:w-[280px] h-[200px] sm:h-[240px] flex-shrink-0 rounded-xl overflow-hidden">
        <Link
          href={`/services/${service.slug}`}
          className="block w-full h-full cursor-pointer"
        >
          <Image
            src={primaryImage}
            alt={service.name}
            width="280"
            height="240"
            className="rounded-lg object-cover w-full h-full"
          />
        </Link>
        {service.isFeatured && (
          <span className="absolute top-3 left-3 bg-[#F8BD36] text-[#0E2A47] text-sm px-4 py-2 rounded-full font-bold shadow-lg">
            ⭐ Featured
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-[#FF6B6B] text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg">
            💰 DEMO Discount
          </span>
        )}
      </div>

      {/* Content Container - Flexible, scrollable if needed */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Link href={`/services/${service.slug}`} className="w-fit">
          <h2 className="text-2xl font-bold text-[#1C3658] mb-2 line-clamp-1">
            {service.name}
          </h2>
        </Link>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {service.description || "Professional party service for your event"}
        </p>
        <ul className="text-sm mt-1 space-y-1 flex-shrink-0">
          {service.packages && service.packages.length > 0 && (
            <li className="text-gray-700">
              📦 {service.packages.length} package
              {service.packages.length !== 1 ? "s" : ""} available
            </li>
          )}
          {service.startingPrice && (
            <li>
              {(() => {
                // Check service discount first
                if (
                  service.discountPrice &&
                  service.discountPrice < service.startingPrice
                ) {
                  return (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-400 line-through">
                        ${service.startingPrice}
                      </span>
                      <span className="text-lg font-bold text-[#FF6B6B]">
                        ${service.discountPrice}
                      </span>
                    </div>
                  );
                }

                // Otherwise check package discounts
                const lowestDiscount = service.packages
                  ?.filter((pkg) => pkg.discountPrice)
                  .map((pkg) => Number(pkg.discountPrice))
                  .sort((a, b) => a - b)[0];

                if (
                  lowestDiscount &&
                  lowestDiscount < Number(service.startingPrice)
                ) {
                  return (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-400 line-through">
                        ${service.startingPrice}
                      </span>
                      <span className="text-lg font-bold text-[#FF6B6B]">
                        ${lowestDiscount}
                      </span>
                    </div>
                  );
                }
                return (
                  <span className="text-green-600 font-semibold">
                    💰 Starting from ${service.startingPrice}
                  </span>
                );
              })()}
            </li>
          )}
        </ul>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex gap-3 mt-auto pt-4">
          <Link href={`/services/${service.slug}`} className="flex-1">
            <Button className="w-full bg-[#F8BD36] text-[#1C3658] hover:bg-[#F8BD36]/90 cursor-pointer">
              More info
            </Button>
          </Link>
          {service.website && (
            <TrackableLink
              href={service.website}
              targetId={service.id}
              targetType="SERVICE"
              className="flex-1"
            >
              <Button className="w-full bg-[#F8BD36] text-[#1C3658] hover:bg-[#F8BD36]/90 cursor-pointer">
                Reserve Service
              </Button>
            </TrackableLink>
          )}
        </div>
      </div>
    </div>
  );
}
