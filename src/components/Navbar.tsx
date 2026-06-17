"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/map", label: "Interactive Map" },
  { href: "/timeline", label: "Timeline" },
  { href: "/text-analysis", label: "Text Analysis" },
  { href: "/methodology", label: "Methodology" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-8 pt-4">
      <div className="mx-auto max-w-content px-6 md:px-10 h-12 flex items-center justify-between bg-background/80 backdrop-blur-md border border-light-gray rounded-full shadow-sm">
        <Link href="/" className="group hover:opacity-75 transition-museum" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-xs uppercase tracking-wider transition-museum hover:text-ink [font-family:var(--font-display)]",
                pathname === link.href ? "text-ink border-b border-ink pb-1" : "text-text-gray"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle navigation"
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="w-6 h-px bg-ink" />
          <span className="w-6 h-px bg-ink" />
          <span className="w-6 h-px bg-ink" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-light-gray bg-background px-6 py-4 flex flex-col gap-4 animate-fadeIn">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={clsx(
                "text-sm uppercase tracking-widest2",
                pathname === link.href ? "text-ink" : "text-text-gray"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
