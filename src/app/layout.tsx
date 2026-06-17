import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

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
      <body className="font-sans bg-background text-ink antialiased cursor-none">
        <CustomCursor />
        <Navbar />
        <main className="min-h-screen pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
