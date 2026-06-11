import { VendorClaimForm } from "@/components/vendor/VendorClaimForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Claim Venue Page
 * Page where vendors can submit a claim request for their venue
 */
export default function ClaimVenuePage() {
  return (
    <div className="min-h-screen text-[#1C3658]">
      <section className="bg-[#1C3658] pt-52 md:pt-56 lg:pt-64 pb-16 md:pb-20 lg:pb-28 text-center relative overflow-hidden">
        {/* Fondo izquierdo - Responsive */}
        <div className="absolute bg-[url('/bnr-izquierdo.png')] bg-no-repeat bg-contain z-0 bottom-0 left-0 w-120 h-72 md:w-100 md:h-60 lg:w-135 lg:h-80 opacity-70 md:opacity-100" />

        {/* Elementos decorativos izquierda - Responsive */}
        <div className="absolute top-16 left-4 md:top-40 md:left-20 lg:top-48 lg:left-80 w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 bg-[url('/bee-izquierda.png')] bg-no-repeat bg-contain z-1 opacity-60 md:opacity-100" />
        <div className="absolute top-24 left-2 md:top-56 md:left-10 lg:top-60 lg:left-40 w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-[url('/bnr-no.png')] bg-no-repeat bg-contain z-1 opacity-0 md:opacity-100" />

        {/* Contenido principal */}
        <div className="relative z-10 px-4 md:px-6">
          <h1 className="text-[#FBF2E0] text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold max-w-4xl mx-auto">
            Add Your Venue to Bashwish
          </h1>
          <p className="text-[#FBF2E0] mt-2 md:mt-3 lg:mt-4 text-base md:text-lg lg:text-xl max-w-2xl mx-auto">
            Partner with Bashwish and reach more families
          </p>
        </div>

        {/* Elementos decorativos derecha - Responsive */}
        <div className="absolute top-16 right-4 md:top-40 md:right-20 lg:top-48 lg:right-80 w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 bg-[url('/bee-derecha.png')] bg-no-repeat bg-contain z-1 opacity-60 md:opacity-100" />
        <div className="absolute top-24 right-2 md:top-56 md:right-10 lg:top-60 lg:right-40 w-0 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-[url('/bnr-na.png')] bg-no-repeat bg-contain z-1 opacity-0 md:opacity-100" />

        {/* Fondo derecho - Responsive */}
        <div className="absolute bg-[url('/bnr-derecha.png')] bg-no-repeat bg-contain z-0 bottom-0 right-0 w-0 h-32 md:w-100 md:h-60 lg:w-135 lg:h-80 opacity-0 md:opacity-100" />
      </section>

      {/* Form Section */}
      <div className="py-20 px-6 md:px-20 lg:px-40">
        <div className="max-w-3xl mx-auto">
          {/* Info Card */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl text-[#1C3658]">
                Why Partner with Bashwish?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#F8BD36] mr-2">✓</span>
                  <span>
                    Reach thousands of parents searching for party venues in
                    Houston
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#F8BD36] mr-2">✓</span>
                  <span>
                    Manage your packages, images, and pricing with our easy
                    dashboard
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#F8BD36] mr-2">✓</span>
                  <span>
                    Get detailed analytics on views, clicks, and bookings
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#F8BD36] mr-2">✓</span>
                  <span>Featured placement opportunities available</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* ✨ VENDOR CLAIM FORM COMPONENT */}
          <VendorClaimForm />

          {/* Help Section */}
          {/* <Card className="mt-8 bg-gray-50">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-2">
                If you have any questions about adding your venue or our
                partnership program, please contact us:
              </p>
              <ul className="space-y-1 text-gray-700">
                <li>
                  📧 Email:{" "}
                  <a
                    href="mailto:hello@bashwish.com"
                    className="text-blue-600 hover:underline"
                  >
                    hello@bashwish.com
                  </a>
                </li>
                <li>📞 Phone: (555) 123-4567</li>
              </ul>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
