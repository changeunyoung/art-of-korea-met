import type { Metadata } from "next";
import { Montserrat, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

const display = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const sans = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ART OF KOREA | The Metropolitan Museum of Art — Curatorial Structures",
  description:
    "A digital humanities project examining how object placement, gallery layout, and curatorial text in the Korean Gallery at The Metropolitan Museum of Art shape visitors' understanding of Korean art.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} font-sans bg-background text-ink antialiased cursor-none`}>
        <CustomCursor />
        <Navbar />
        <main className="min-h-screen pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
