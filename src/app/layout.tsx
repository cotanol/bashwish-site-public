import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Baloo_Chettan_2 } from "next/font/google";
import Footer from "@/components/Footer";
import PartyGenieChat from "@/components/PartyGenieChat";

const baloo = Baloo_Chettan_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-baloo",
});

export const metadata: Metadata = {
  title: "DEMO | Multitenant SaaS for Party Venues | Lead Tracking",
  description:
    "A multitenant SaaS platform for party venues to track leads and manage their business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={baloo.variable}>
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className="font-baloo bg-[#FBF2E0] text-[#0E2A47] min-h-screen">
        <Header />
        <main className="bg-[#FBF2E0]">{children}</main>
        <Footer />
        <PartyGenieChat />
      </body>
    </html>
  );
}
