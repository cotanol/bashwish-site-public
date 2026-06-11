import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Cake, MapPin, Ticket, Users } from "lucide-react";
import type { Venue } from "@/lib/api";
import TrackableLink from "../common/TrackableLink";

interface DetailVenueTabProps {
  venue: Venue;
}

export default function DetailVenueTab({ venue }: DetailVenueTabProps) {
  // Compute data from packages
  const allThemes = venue.packages.flatMap((pkg) =>
    pkg.themes.map((t) => t.theme)
  );
  const uniqueThemes = Array.from(
    new Map(allThemes.map((theme) => [theme.id, theme])).values()
  );

  const ageMin = Math.min(
    ...venue.packages.map((pkg) => pkg.ageMin || 0).filter((age) => age > 0)
  );
  const ageMax = Math.max(...venue.packages.map((pkg) => pkg.ageMax || 100));
  const minKids = Math.min(
    ...venue.packages.map((pkg) => pkg.minKids || 0).filter((kids) => kids > 0)
  );
  const maxKids = Math.max(...venue.packages.map((pkg) => pkg.maxKids || 0));

  const hasAgeRange = ageMin > 0 && ageMax < 100;
  const hasCapacityRange = minKids > 0 && maxKids > 0;

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between mb-8 py-4 px-4 gap-4">
        {/* Navegación: flex-wrap para que los botones bajen si no caben y centrado en móvil */}
        <nav className="flex flex-wrap justify-center lg:justify-start items-center gap-2 w-full lg:w-auto">
          <Button
            variant="ghost"
            asChild
            className="text-[#1C3658] font-semibold py-2 px-4 rounded-4xl border-2 border-[#000000] shadow-[2px_2px_0_#000000] bg-[#F8BD36] hover:shadow-[4px_4px_0_#000000] transition-all text-sm sm:text-base"
          >
            <a href="#informacion">📝 General Info</a>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="text-[#1C3658] font-semibold py-2 px-4 rounded-4xl border-2 border-[#000000] shadow-[2px_2px_0_#000000] bg-[#F8BD36] hover:shadow-[4px_4px_0_#000000] transition-all text-sm sm:text-base"
          >
            <a href="#paquetes">🎁 Packages</a>
          </Button>
        </nav>

        {/* Botón de acción: Ancho completo en móvil para fácil clic */}
        {venue.website ? (
          <TrackableLink
            href={venue.website}
            targetId={venue.id}
            targetType="VENUE"
            vendorId={venue.vendorId}
            className="w-full lg:w-auto"
          >
            <Button
              variant="golden"
              size="golden"
              className="w-full lg:w-auto text-[#1C3658] font-semibold py-2 px-4 rounded-4xl border-2 border-[#000000] shadow-[2px_2px_0_#000000] bg-[#F8BD36] hover:shadow-[4px_4px_0_#000000] transition-all"
            >
              ✅ Reserve Venue
            </Button>
          </TrackableLink>
        ) : venue.phone ? (
          <a href={`tel:${venue.phone}`} className="w-full lg:w-auto">
            <Button
              variant="golden"
              size="golden"
              className="w-full lg:w-auto text-[#1C3658] font-semibold py-2 px-4 rounded-4xl border-2 border-[#000000] shadow-[2px_2px_0_#000000] bg-[#F8BD36] hover:shadow-[4px_4px_0_#000000] transition-all"
            >
              📞 Call to Reserve
            </Button>
          </a>
        ) : (
          <Button
            variant="golden"
            size="golden"
            disabled
            className="w-full lg:w-auto text-[#1C3658] font-semibold py-2 px-4 rounded-4xl border-2 border-[#000000] shadow-[2px_2px_0_#000000] bg-[#F8BD36] hover:shadow-[4px_4px_0_#000000] transition-all opacity-50"
          >
            ℹ️ Contact for Reservation
          </Button>
        )}
      </div>

      {/* GRID PRINCIPAL: 1 columna en móvil, 3 en pantallas grandes (lg) */}
      <div
        id="informacion"
        className="scroll-m-20 grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* TARJETA INFO: Ocupa todo en móvil, 2/3 en desktop */}
        <Card className="col-span-1 lg:col-span-2 bg-transparent border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-3xl sm:text-4xl font-bold">
              {venue.name}
            </CardTitle>
            <div className="flex items-center gap-1 pt-1">
              <span className="text-sm text-muted-foreground">
                {venue.reviews?.length || 0} reviews
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base">
              {venue.description || "Venue description not available."}
            </p>
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Highlights</h3>
              {/* Grid interna de highlights: 1 col en móvil muy pequeño, 2 en móvil normal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Capacity</span>
                    <p className="text-sm text-muted-foreground">
                      {hasCapacityRange
                        ? `${minKids}-${maxKids} kids`
                        : "Reserve Venue"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Cake className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Recommended Age</span>
                    <p className="text-sm text-muted-foreground">
                      {hasAgeRange ? `${ageMin}-${ageMax} years` : "All ages"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Ticket className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Starting Price</span>
                    {venue.discountPrice && venue.discountPrice < (venue.startingPrice || 0) ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 line-through">
                          ${venue.startingPrice}
                        </span>
                        <span className="text-sm font-bold text-[#FF6B6B]">
                          ${venue.discountPrice}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {venue.startingPrice
                          ? `$${venue.startingPrice}`
                          : "Contact us"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-4">
              {uniqueThemes.map((theme) => (
                <Badge key={theme.id} className="bg-[#F8BD36] text-[#1C3658]">
                  {theme.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* MAPA: Cae debajo en móvil, se pone al lado en desktop */}
        <Card className="col-span-1 bg-transparent border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Explore the Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            {venue.latitude && venue.longitude && (
              <div className="relative h-[250px] mb-6 overflow-hidden rounded-lg border w-full">
                <iframe
                  src={`https://www.google.com/maps?q=${venue.latitude},${venue.longitude}&output=embed`}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  className="absolute top-0 left-0 w-full h-full border-none"
                ></iframe>
              </div>
            )}
            {/* Venue Address */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">Venue Address</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                {venue.address}, {venue.city} {venue.postalCode}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* PAQUETES: Ya tenías esto bien responsive, solo aseguré el padding */}
      <div id="paquetes" className="scroll-m-20">
        <Card className="bg-transparent border-0 shadow-none px-0">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Packages & Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {venue.packages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {venue.packages.map((pkg) => (
                  <Card key={pkg.id} className="flex flex-col h-full relative">
                    {pkg.discountPrice && pkg.discountPrice < pkg.price && (
                      <span className="absolute -top-3 -right-3 bg-[#FF6B6B] text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg z-10">
                        💰 BashWish Discount
                      </span>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl">{pkg.name}</CardTitle>
                      {pkg.discountPrice && pkg.discountPrice < pkg.price ? (
                        <div className="flex items-center gap-2 pt-2">
                          <span className="text-lg font-bold text-gray-400 line-through">
                            ${pkg.price}
                          </span>
                          <span className="text-2xl font-bold text-[#FF6B6B]">
                            ${pkg.discountPrice}
                          </span>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold pt-2">${pkg.price}</p>
                      )}
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground mb-4">
                        {pkg.description || "Special package for your party"}
                      </p>
                      <Separator />
                      <ul className="space-y-3 mt-4">
                        {/* Contenido de la lista... */}
                        {pkg.ageMin && pkg.ageMax && (
                          <li className="flex items-center gap-2">
                            <Cake className="w-5 h-5 text-primary" />
                            <span>
                              Ages{" "}
                              <span className="font-semibold">
                                {pkg.ageMin}-{pkg.ageMax} years
                              </span>
                            </span>
                          </li>
                        )}
                        {/* Resto de tu lógica de paquetes... */}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No packages available at this time.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
