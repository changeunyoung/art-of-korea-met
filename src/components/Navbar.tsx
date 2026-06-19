"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import clsx from "clsx";

interface NavLink {
  href: string;
  label: string;
  sublinks?: { href: string; label: string }[];
}

const links: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/map", label: "Interactive Map" },
  { href: "/timeline", label: "Timeline" },
  {
    href: "/text-analysis",
    label: "Text Analysis",
    sublinks: [
      { href: "/text-analysis#stats", label: "Overview" },
      { href: "/text-analysis#word-cloud", label: "Word Cloud" },
      { href: "/text-analysis#top-keywords", label: "Top Keywords" },
      { href: "/text-analysis#theme-explorer", label: "Theme Explorer" },
    ],
  },
  { href: "/game", label: "Mini Game" },
  {
    href: "/about",
    label: "About",
    sublinks: [
      { href: "/about#about", label: "About the Project" },
      { href: "/about#research-question", label: "Research Question" },
      { href: "/about#research-process", label: "Research Process" },
      { href: "/about#limitations", label: "Limitations" },
      { href: "/about#credits", label: "Credits" },
    ],
  },
  { href: "/survey", label: "Survey" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (href: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(href);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-8 pt-4">
      <div className="mx-auto max-w-content px-6 md:px-10 h-12 flex items-center justify-between bg-background/80 backdrop-blur-md border border-light-gray rounded-full shadow-sm">
        <Link href="/" className="group hover:opacity-75 transition-museum flex items-center -ml-7">
          <img src="/images/logo/logo_1.png" alt="Art of Korea" className="h-14 w-auto mt-3" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5">
          {links.map((link) => (
            <div
              key={link.href}
              className="relative w-fit"
              onMouseEnter={() => link.sublinks && handleMouseEnter(link.href)}
              onMouseLeave={() => link.sublinks && handleMouseLeave()}
            >
              <Link
                href={link.href}
                className={clsx(
                  "text-xs uppercase tracking-wider transition-museum hover:text-ink [font-family:var(--font-display)]",
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "text-ink border-b border-ink pb-1"
                    : "text-text-gray"
                )}
              >
                {link.label}
              </Link>

              {/* Dropdown */}
              {link.sublinks && (
                <div
                  className="absolute top-full mt-3 py-1.5 w-[160px] z-50 overflow-hidden pointer-events-none"
                  style={{
                    backgroundColor: "rgba(245, 244, 242, 0.75)",
                    backdropFilter: "blur(8px)",
                    left: "50%",
                    marginLeft: "-80px",
                    transformOrigin: "top center",
                    opacity: openDropdown === link.href ? 1 : 0,
                    transform: openDropdown === link.href ? "scaleY(1) translateY(0)" : "scaleY(0.85) translateY(-6px)",
                    transition: "opacity 0.22s cubic-bezier(0.4,0,0.2,1), transform 0.22s cubic-bezier(0.4,0,0.2,1)",
                    pointerEvents: openDropdown === link.href ? "auto" : "none",
                  }}
                  onMouseEnter={() => handleMouseEnter(link.href)}
                  onMouseLeave={handleMouseLeave}
                >
                  {link.sublinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block px-3 py-1.5 text-[8px] uppercase tracking-widest2 text-text-gray hover:text-ink hover:bg-background-soft transition-museum [font-family:var(--font-display)]"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
            <div key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "block text-sm uppercase tracking-widest2",
                  pathname === link.href ? "text-ink" : "text-text-gray"
                )}
              >
                {link.label}
              </Link>
              {link.sublinks && (
                <div className="mt-2 ml-3 flex flex-col gap-2">
                  {link.sublinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setOpen(false)}
                      className="text-xs uppercase tracking-widest2 text-text-gray hover:text-ink transition-museum"
                    >
                      — {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}
