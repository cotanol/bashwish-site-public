import { getServices, getThemes, type Service } from "@/lib/api";
import ServiceCard from "../../components/service/ServiceCard";
import ServiceFilters from "../../components/service/ServiceFilters";
import LocationSection from "@/components/map/LocationSection";

interface ServicesPageProps {
  searchParams: Promise<{
    search?: string;
    kids?: string;
    age?: string;
    gender?: string;
    themes?: string;
    date?: string;
    page?: string;
  }>;
}

export default async function ServicesPage({
  searchParams,
}: ServicesPageProps) {
  // Await searchParams (Next.js 15 requirement)
  const params = await searchParams;

  // Fetch themes for filters
  let themesData: { id: string; name: string; slug: string }[] = [];
  try {
    themesData = await getThemes();
  } catch (err) {
    console.error("Error fetching themes:", err);
  }

  // Build filters from search params for API call
  const filters: Record<string, string | number> = {};

  if (params.search) filters.search = params.search;
  if (params.kids) filters.kids = Number(params.kids);
  if (params.age) filters.age = Number(params.age);
  if (params.gender && params.gender !== "neutral") {
    filters.gender = params.gender;
  }
  if (params.themes) filters.themes = params.themes;

  // Pagination
  const currentPage = Number(params.page) || 1;
  const limit = 10;

  // Fetch services with ALL filters applied in backend
  let servicesData: Service[] = [];
  let totalPages = 1;
  let total = 0;
  let error = null;

  try {
    const response = await getServices({
      ...filters,
      page: currentPage,
      limit,
    });
    servicesData = response.data.services;
    totalPages =
      response.data.pagination.pages ||
      (response.data.services.length > 0 ? 1 : 0);
    total = response.data.pagination.total;
  } catch (err) {
    console.error("Error fetching services:", err);
    error = "Failed to load services. Please try again later.";
  }

  // --- PREPARACIÓN DE DATOS PARA EL MAPA ---
  // Filtramos SOLO services que tengan información de ubicación válida
  // Como los services no tienen coordenadas, creamos un array vacío
  // Si en el futuro agregas coordenadas a services, puedes usar la misma lógica que venues
  const mapLocations = servicesData
    .filter(
      (s) =>
        s.latitude !== null &&
        s.longitude !== null &&
        s.latitude !== undefined &&
        s.longitude !== undefined
    )
    .map((s) => {
      // Extracción segura de la imagen principal
      const primaryImage = s.images?.find((img) => img.isPrimary);
      const firstImage = primaryImage || s.images?.[0];
      const imageUrl = firstImage?.url || "/party-genie.png";

      // Calcular precio a mostrar (con descuento si existe)
      const displayPrice = s.discountPrice
        ? `$${s.discountPrice}`
        : s.startingPrice
        ? `$${s.startingPrice}`
        : "Consultar";

      // Calcular rating promedio de reviews
      const avgRating =
        s.reviews && s.reviews.length > 0
          ? (
              s.reviews.reduce((sum, r) => sum + r.rating, 0) / s.reviews.length
            ).toFixed(1)
          : undefined;

      return {
        id: s.id,
        slug: s.slug,
        vendorId: undefined, // Services no tienen vendorId
        name: s.name,
        price: displayPrice,
        originalPrice: s.startingPrice,
        discountPrice: s.discountPrice,
        lat: s.latitude!,
        lng: s.longitude!,
        image: imageUrl,
        rating: avgRating,
      };
    });

  return (
    <div className="min-h-screen text-[#1C3658]">
      {/* Header */}
      <section className="bg-[#1C3658] pt-52 md:pt-56 lg:pt-64 pb-16 md:pb-20 lg:pb-28 text-center relative overflow-hidden">
        {/* Fondo izquierdo - Responsive */}
        <div className="absolute bg-[url('/bnr-izquierdo.png')] bg-no-repeat bg-contain z-0 bottom-0 left-0 w-120 h-72 md:w-100 md:h-60 lg:w-135 lg:h-80 opacity-70 md:opacity-100" />

        {/* Elementos decorativos izquierda - Responsive */}
        <div className="absolute top-16 left-4 md:top-40 md:left-20 lg:top-48 lg:left-80 w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 bg-[url('/bee-izquierda.png')] bg-no-repeat bg-contain z-1 opacity-60 md:opacity-100" />
        <div className="absolute top-24 left-2 md:top-56 md:left-10 lg:top-60 lg:left-40 w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-[url('/bnr-no.png')] bg-no-repeat bg-contain z-1 opacity-0 md:opacity-100" />

        {/* Contenido principal */}
        <div className="relative z-10 px-4 md:px-6">
          <h1 className="text-[#FBF2E0] text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold max-w-4xl mx-auto">
            Find Your Perfect Service
          </h1>
        </div>

        {/* Elementos decorativos derecha - Responsive */}
        <div className="absolute top-16 right-4 md:top-40 md:right-20 lg:top-48 lg:right-80 w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 bg-[url('/bee-derecha.png')] bg-no-repeat bg-contain z-1 opacity-60 md:opacity-100" />
        <div className="absolute top-24 right-2 md:top-56 md:right-10 lg:top-60 lg:right-40 w-0 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-[url('/bnr-na.png')] bg-no-repeat bg-contain z-1 opacity-0 md:opacity-100" />

        {/* Fondo derecho - Responsive */}
        <div className="absolute bg-[url('/bnr-derecha.png')] bg-no-repeat bg-contain z-0 bottom-0 right-0 w-0 h-32 md:w-100 md:h-60 lg:w-135 lg:h-80 opacity-0 md:opacity-100" />
      </section>

      {/* Main Content */}
      <div className="py-10 md:py-16 lg:py-20 flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 px-4 sm:px-6 md:px-20 lg:px-40">
        {/* Sidebar with Filters and Map */}
        <aside className="lg:w-1/3 space-y-4 md:space-y-6">
          {/* Mapa - Solo se muestra si hay services con coordenadas */}
          {<LocationSection data={mapLocations} />}

          {/* Filters */}
          <ServiceFilters
            themes={themesData}
            initialFilters={{
              search: params.search,
              kids: params.kids ? Number(params.kids) : undefined,
              age: params.age ? Number(params.age) : undefined,
              gender: params.gender,
              selectedThemes: params.themes?.split(",") || [],
            }}
          />
        </aside>

        {/* Services List */}
        <section className="flex-1 flex flex-col">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 md:px-4 py-2 md:py-3 rounded mb-3 md:mb-4 text-sm md:text-base">
              <strong>Error:</strong> {error}
            </div>
          )}

          {!error && servicesData.length === 0 && (
            <div className="flex-1 h-auto min-h-[300px] md:min-h-[400px] flex items-center justify-center">
              <div className="text-center py-8 md:py-12 bg-gray-50 rounded-lg p-6 md:p-8 border border-[#000000] shadow-[2px_2px_0_#000000] md:shadow-[3px_3px_0_#000000] mx-2 md:mx-0">
                <p className="text-xl md:text-2xl text-[#1C3658] font-bold mb-2">
                  No services found
                </p>
                <p className="text-base md:text-lg text-[#1C3658]/70">
                  Try adjusting your filters or search criteria.
                </p>
              </div>
            </div>
          )}

          {servicesData.length > 0 && (
            <div className="mb-3 md:mb-4">
              <p className="text-base md:text-lg text-[#1C3658]">
                Found <strong>{total}</strong> service{total !== 1 ? "s" : ""}{" "}
                (Page {currentPage} of {totalPages})
              </p>
            </div>
          )}

          {/* Services Grid */}
          <div className="flex-1 space-y-6 md:space-y-8 lg:space-y-10">
            {servicesData.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                variant="default"
              />
            ))}
          </div>

          {/* Pagination - Always visible at bottom */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4 mt-8 md:mt-10 pt-4 md:pt-6">
            {currentPage > 1 ? (
              <a
                href={`/services?${new URLSearchParams({
                  ...params,
                  page: String(currentPage - 1),
                }).toString()}`}
                className="px-4 py-2 md:px-6 md:py-3 bg-[#F8BD36] text-[#0E2A47] font-bold border-2 border-[#000000] shadow-[2px_2px_0_#000000] md:shadow-[3px_3px_0_#000000] hover:shadow-[4px_4px_0_#000000] md:hover:shadow-[5px_5px_0_#000000] transition-all rounded-full text-sm md:text-base w-full sm:w-auto text-center cursor-pointer"
              >
                ← Previous
              </a>
            ) : (
              <span className="px-4 py-2 md:px-6 md:py-3 bg-gray-300 text-gray-500 font-bold border-2 border-[#000000] shadow-[2px_2px_0_#000000] md:shadow-[3px_3px_0_#000000] cursor-not-allowed rounded-full text-sm md:text-base w-full sm:w-auto text-center">
                ← Previous
              </span>
            )}

            <span className="text-base md:text-lg font-semibold text-[#1C3658] py-2 md:py-0">
              Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages ? (
              <a
                href={`/services?${new URLSearchParams({
                  ...params,
                  page: String(currentPage + 1),
                }).toString()}`}
                className="px-4 py-2 md:px-6 md:py-3 bg-[#F8BD36] text-[#0E2A47] font-bold border-2 border-[#000000] shadow-[2px_2px_0_#000000] md:shadow-[3px_3px_0_#000000] hover:shadow-[4px_4px_0_#000000] md:hover:shadow-[5px_5px_0_#000000] transition-all rounded-full text-sm md:text-base w-full sm:w-auto text-center cursor-pointer"
              >
                Next →
              </a>
            ) : (
              <span className="px-4 py-2 md:px-6 md:py-3 bg-gray-300 text-gray-500 font-bold border-2 border-[#000000] shadow-[2px_2px_0_#000000] md:shadow-[3px_3px_0_#000000] cursor-not-allowed rounded-full text-sm md:text-base w-full sm:w-auto text-center">
                Next →
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
