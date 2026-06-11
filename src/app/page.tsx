import { SearchVenueService } from "@/components/search/Search";
import FeaturedVenues from "@/components/venue/FeaturedVenues";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import { getThemes } from "@/lib/api";

// Force static generation - no dynamic rendering
export const dynamic = "force-static";
export const revalidate = 300; // Revalidate every 5 minutes

export default async function Home() {
  // Fetch themes for the search form
  let themesData: { id: string; name: string; slug: string }[] = [];
  try {
    themesData = await getThemes();
  } catch (err) {
    console.error("Error fetching themes:", err);
  }
  return (
    <div className="text-white min-h-screen">
      <SearchVenueService themes={themesData} />

      {/* Categorías - Texto en movimiento */}
      <section className="bg-[#1C3658] py-6 md:py-8 overflow-hidden whitespace-nowrap relative mt-14 md:mt-44">
        <div className="animate-marquee text-white text-lg md:text-2xl lg:text-3xl font-semibold px-4 md:px-6">
          <span className="text-yellow-400 mr-1">⭐</span>
          Currently available in Houston. More cities coming soon!
          <span className="text-yellow-400 mr-1">⭐</span>
          Currently available in Houston. More cities coming soon!
          <span className="text-yellow-400 mr-1">⭐</span>
          Currently available in Houston. More cities coming soon!
          <span className="text-yellow-400 mr-1">⭐</span>
          Currently available in Houston. More cities coming soon!
          <span className="text-yellow-400 mr-1">⭐</span>
          Currently available in Houston. More cities coming soon!
        </div>
      </section>

      {/* Featured Venues - Dynamic from API */}
      <FeaturedVenues />
      {/* 
      <section className="text-center pt-0 pb-20 md:pb-44 px-4 sm:px-6 md:px-20 lg:px-40">
        <div className="animate-bounce-slow">
          <Image
            src="/pro-medio.png"
            alt="Kids Party"
            width={100}
            height={100}
            className="object-cover mx-auto mb-6 md:mb-8 drop-shadow-lg w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32"
          />
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1C3658] mb-4 md:mb-6 tracking-tight">
          What Parents Say
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-[#1C3658]/80 max-w-2xl mx-auto mb-12 md:mb-16 leading-relaxed">
          Real stories from families who created unforgettable memories with us.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
          {[
            {
              name: "Jessika Lisa",
              role: "Fashion Designer",
              color: "bg-[#1C3658]",
            },
            {
              name: "Kimberly",
              role: "Fashion Designer",
              color: "bg-[#F8BD36]",
            },
            {
              name: "Amanda Carol",
              role: "Fashion Designer",
              color: "bg-[#1C3658]",
            },
            {
              name: "Kimberly",
              role: "Fashion Designer",
              color: "bg-[#F8BD36]",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`${item.color} text-[#FBF2E0] p-6 md:p-8 rounded-xl md:rounded-2xl border-2 border-[#000000] shadow-[3px_3px_0_#000000] md:shadow-[4px_4px_0_#000000] hover:shadow-[5px_5px_0_#000000] md:hover:shadow-[6px_6px_0_#000000] hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="text-xl md:text-2xl text-yellow-300 mb-3 md:mb-4">★★★★★</div>
              <p className="text-sm md:text-base mb-4 md:mb-6 italic leading-relaxed">
                "Excellent service and great collection. My kid loves every
                product we bought here!"
              </p>
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 rounded-full overflow-hidden border-4 border-[#FBF2E0] shadow-lg">
                <img
                  src="/av-girl.png"
                  alt="Kids Group"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-base md:text-lg font-bold">{item.name}</h3>
              <p className="text-xs md:text-sm text-gray-200 opacity-90">{item.role}</p>
            </div>
          ))}
        </div>
      </section>
*/}
      {/* Sección intermedia con fondo estrellado */}
      <section className="relative pt-20 md:pt-32 lg:pt-44 pb-20 md:pb-32 lg:pb-44">
        {/* Fondo azul con estrellitas */}
        <div
          className="absolute inset-0 bg-[#1C3658] bg-[url('/dots.png')] bg-cover z-0"
          style={{ height: "calc(100% - 200px)" }}
        />

        {/* Tarjeta amarilla encima */}
        <div className="relative z-10 bg-gradient-to-br from-[#F8BD36] to-[#f7a600] mx-4 sm:mx-6 md:mx-20 lg:mx-40 rounded-2xl md:rounded-3xl border-2 border-black shadow-[4px_4px_0_#000000] md:shadow-[6px_6px_0_#000000] p-6 md:p-8 lg:p-16 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="md:w-1/2 space-y-4 md:space-y-6 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#1C3658] leading-tight">
              Create Magical Moments For Your Kids.
            </h2>

            <div className="text-[#1C3658] text-base md:text-lg lg:text-xl xl:text-2xl space-y-2">
              <p className="font-bold">
                Do you want to receive Bashwish news and offers?
              </p>
              <p>Join our community:</p>
            </div>

            {/* 2. Formulario de Captura de Email */}
            <NewsletterForm />
          </div>

          <div className="md:w-1/2 md:mt-0 flex justify-center md:justify-end relative h-[300px] md:h-[400px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ft-ns.jpg"
              alt="Kids Group"
              className="w-full max-w-md md:max-w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
