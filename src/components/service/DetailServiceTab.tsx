"use client";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Star, Users, Cake, Ticket } from "lucide-react";
import type { Service } from "@/lib/api";
import TrackableLink from "../common/TrackableLink";

interface DetailServiceTabProps {
  service: Service;
}

export default function DetailServiceTab({ service }: DetailServiceTabProps) {
  // Compute data from packages - with safe fallbacks
  const allThemes = service.packages.flatMap(
    (pkg) => pkg.themes?.map((t) => t.theme) || [],
  );
  const uniqueThemes = Array.from(
    new Map(allThemes.map((theme) => [theme.id, theme])).values(),
  );

  const ageMin = Math.min(
    ...service.packages.map((pkg) => pkg.ageMin || 0).filter((age) => age > 0),
  );
  const ageMax = Math.max(...service.packages.map((pkg) => pkg.ageMax || 100));
  const minKids = Math.min(
    ...service.packages
      .map((pkg) => pkg.minKids || 0)
      .filter((kids) => kids > 0),
  );
  const maxKids = Math.max(...service.packages.map((pkg) => pkg.maxKids || 0));

  const hasAgeRange = ageMin > 0 && ageMax < 100;
  const hasCapacityRange = minKids > 0 && maxKids > 0;

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between mb-8 py-4 px-4 gap-4">
        {/* Navegación: flex-wrap y centrado en móvil */}
        <nav className="flex flex-wrap justify-center lg:justify-start items-center gap-2 w-full lg:w-auto">
          <Button
            variant="ghost"
            asChild
            className="text-[#1C3658] font-semibold py-2 px-4 rounded-4xl border-2 border-[#000000] shadow-[2px_2px_0_#000000] bg-[#F8BD36] hover:shadow-[4px_4px_0_#000000] transition-all text-sm sm:text-base"
          >
            <a href="#informacion">📝 General Information</a>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="text-[#1C3658] font-semibold py-2 px-4 rounded-4xl border-2 border-[#000000] shadow-[2px_2px_0_#000000] bg-[#F8BD36] hover:shadow-[4px_4px_0_#000000] transition-all text-sm sm:text-base"
          >
            <a href="#paquetes">🎁 Packages & Pricing</a>
          </Button>
        </nav>

        {/* Botones de acción: Stack vertical en móvil, fila en desktop */}
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          {service.website && (
            <TrackableLink
              href={service.website}
              targetId={service.id}
              targetType="SERVICE"
              vendorId={null}
              className="w-full sm:w-auto"
            >
              <Button
                variant="golden"
                size="golden"
                className="w-full sm:w-auto text-[#1C3658] font-semibold py-2 px-4 rounded-4xl border-2 border-[#000000] shadow-[2px_2px_0_#000000] bg-[#F8BD36] hover:shadow-[4px_4px_0_#000000] transition-all"
              >
                ✅ Reserve Service
              </Button>
            </TrackableLink>
          )}
          {service.phone && !service.website && (
            <a href={`tel:${service.phone}`} className="w-full sm:w-auto">
              <Button
                variant="golden"
                size="golden"
                className="w-full sm:w-auto text-[#1C3658] font-semibold py-2 px-4 rounded-4xl border-2 border-[#000000] shadow-[2px_2px_0_#000000] bg-[#F8BD36] hover:shadow-[4px_4px_0_#000000] transition-all"
              >
                📞 Call Now
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* General Information Grid: 1 col en móvil, 3 en desktop */}
      <div
        id="informacion"
        className="scroll-m-20 grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Columna Izquierda (Info): Ocupa 2/3 en desktop */}
        <Card className="col-span-1 lg:col-span-2 bg-transparent border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-3xl sm:text-4xl font-bold">
              {service.name}
            </CardTitle>
            <div className="flex items-center gap-1 pt-1">
              <span className="text-sm text-muted-foreground">
                {service.reviews?.length || 0} reviews
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base">
              {service.description || "Service description not available."}
            </p>

            {/* Highlights Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Highlights</h3>
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
                    {service.discountPrice &&
                    service.discountPrice < (service.startingPrice || 0) ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 line-through">
                          ${service.startingPrice}
                        </span>
                        <span className="text-sm font-bold text-[#FF6B6B]">
                          ${service.discountPrice}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {service.startingPrice
                          ? `$${service.startingPrice}`
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

        {/* Columna Derecha (Contacto): Ocupa 1/3 en desktop, cae abajo en móvil */}
        <Card className="col-span-1 bg-transparent border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Service Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Contact Information */}
            {service.phone && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">📞 Phone</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  <a
                    href={`tel:${service.phone}`}
                    className="hover:underline cursor-pointer"
                  >
                    {service.phone}
                  </a>
                </p>
              </div>
            )}
            {service.website && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">🌐 Website</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  <a
                    href={service.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline cursor-pointer"
                  >
                    Reserve Service
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Packages Grid */}
      <div id="paquetes" className="scroll-m-20">
        <Card className="bg-transparent border-0 shadow-none px-0">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Packages & Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {service.packages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.packages.map((pkg) => (
                  <Card key={pkg.id} className="flex flex-col h-full relative">
                    {pkg.discountPrice && pkg.discountPrice < pkg.price && (
                      <span className="absolute -top-3 -right-3 bg-[#FF6B6B] text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg z-10">
                        💰 DEMO Discount
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
                        {pkg.minKids && pkg.maxKids && (
                          <li className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            <span>
                              {pkg.minKids === pkg.maxKids ? (
                                <span className="font-semibold">
                                  {pkg.maxKids} kids
                                </span>
                              ) : (
                                <>
                                  From{" "}
                                  <span className="font-semibold">
                                    {pkg.minKids}-{pkg.maxKids} kids
                                  </span>
                                </>
                              )}
                            </span>
                          </li>
                        )}
                        {pkg.themes && pkg.themes.length > 0 && (
                          <li className="flex items-start gap-2">
                            <Star className="w-5 h-5 text-primary mt-0.5" />
                            <div className="flex flex-wrap gap-1">
                              {pkg.themes.map((t) => (
                                <Badge
                                  key={t.theme.id}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {t.theme.name}
                                </Badge>
                              ))}
                            </div>
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No packages available at this time. Contact the service provider
                directly for more information.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
