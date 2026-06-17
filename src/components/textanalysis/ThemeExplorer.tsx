"use client";

import { useState, useRef, useCallback } from "react";

export interface ThemeDefinition {
  name: string;
  description: string;
  keywords: string[];
}

export const THEMES: ThemeDefinition[] = [
  {
    name: "Dynastic History",
    description:
      "How the gallery situates objects within the flow of historical periods and royal dynasties, framing Korean art as a chronicle of succession.",
    keywords: ["dynasty", "Goryeo", "Joseon", "century", "period", "historical"],
  },
  {
    name: "Materials & Techniques",
    description: "Language that foregrounds the physical materials and specialized craft techniques used to make objects, valuing artisanal mastery.",
    keywords: ["bronze", "celadon", "glaze", "inlaid", "porcelain", "stoneware", "silver", "incised", "openwork"],
  },
  {
    name: "Religion & Ritual",
    description: "Language emphasizing religious meaning, ritual function, and spiritual symbolism — particularly Buddhist traditions that shaped Korean art.",
    keywords: ["Buddhist", "temple", "ritual", "offering", "consecration", "Sanskrit"],
  },
  {
    name: "Everyday Life & Function",
    description: "Language describing how objects were used in daily life and domestic settings, connecting art to lived human experience.",
    keywords: ["mirror", "bowl", "vessel", "jar", "seal", "box", "container"],
  },
  {
    name: "Collecting History",
    description: "Language revealing how the Met's Korean collection was formed through donors, funds, and acquisitions — the institutional history behind each object.",
    keywords: ["gift", "purchase", "collection", "fund", "foundation", "Rogers", "acquisition"],
  },
  {
    name: "Cultural Identity",
    description: "Language that emphasizes the continuity and distinctiveness of Korean culture, tradition, and national identity across time.",
    keywords: ["Korean", "culture", "tradition", "heritage", "identity", "society"],
  },
];

const ICONS: Record<string, React.ReactNode> = {
  "Dynastic History": (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 24h20M8 24V14l8-6 8 6v10" strokeLinejoin="round" />
      <path d="M13 24v-6h6v6" strokeLinejoin="round" />
    </svg>
  ),
  "Materials & Techniques": (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 6h8l2 4-3 14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2L10 10z" strokeLinejoin="round" />
      <path d="M11 12h10" />
    </svg>
  ),
  "Religion & Ritual": (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="16" cy="13" r="5" />
      <path d="M16 18v8M9 26h14M11 22c2-2 8-2 10 0" strokeLinecap="round" />
    </svg>
  ),
  "Everyday Life & Function": (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 14h20l-2 8a4 4 0 0 1-4 3H12a4 4 0 0 1-4-3z" strokeLinejoin="round" />
      <path d="M11 14a5 5 0 0 1 10 0" />
    </svg>
  ),
  "Collecting History": (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="6" width="20" height="20" rx="1" />
      <circle cx="12" cy="13" r="2" />
      <path d="M6 22l5-5 4 4 5-6 6 7" strokeLinejoin="round" />
    </svg>
  ),
  "Cultural Identity": (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="16" cy="16" r="10" />
      <path d="M16 6v20M6 16h20" />
    </svg>
  ),
};

const CARD_W = 256;
const CARD_H = 400;
const SPREAD = 112;
const CARD_RADIUS = 14;
const N = THEMES.length;
// Extra vertical room above cards so scale+lift don't get clipped (scale=1.07, lift=22px → ~50px headroom needed)
const CARD_TOP_OFFSET = 60;

// Face base: position + backface only — NO overflow:hidden (that would force 2D compositing
// and break backface-visibility). Clipping is handled by an inner content wrapper.
const faceStyle: React.CSSProperties = {
  position: "absolute",
  top: 0, left: 0, right: 0, bottom: 0,
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};

// Inner wrapper handles visual clipping (border-radius + overflow) without touching the 3D face.
const faceContentStyle: React.CSSProperties = {
  position: "absolute",
  top: 0, left: 0, right: 0, bottom: 0,
  borderRadius: CARD_RADIUS,
  overflow: "hidden",
};

interface ThemeExplorerProps {
  selectedTheme: string | null;
  onSelectTheme: (theme: string | null) => void;
  onSelectKeyword: (keyword: string) => void;
}

export default function ThemeExplorer({ selectedTheme, onSelectTheme, onSelectKeyword }: ThemeExplorerProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < N; i++) {
      const center = SPREAD * i + CARD_W / 2;
      const d = Math.abs(x - center);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    setActiveIdx(best);
  }, []);

  const deckW = SPREAD * (N - 1) + CARD_W;

  return (
    <div className="w-full" style={{ overflow: "visible" }}>
      <div
        ref={containerRef}
        className="relative mx-auto"
        style={{ width: deckW, height: CARD_H + CARD_TOP_OFFSET + 20 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActiveIdx(null)}
      >
        {THEMES.map((theme, i) => {
          const isActive = activeIdx !== null && i === activeIdx;
          const isFiltering = selectedTheme === theme.name;
          const isFlipped = isFiltering && isActive; // flip = clicked AND cursor is near this card
          const refIdx = activeIdx ?? 2; // neutral fan center when no hover
          const offset = i - refIdx;
          const abs = Math.abs(offset);

          const ty = isActive ? -22 : abs * 5;
          const rot = offset * 2.8;
          const scale = isActive ? 1.07 : Math.max(0.87, 1 - abs * 0.024);
          // Active card gets a dramatically higher z-index so it always paints above all siblings,
          // regardless of any 3D rendering order effects from the fan rotation transforms.
          const z = isActive ? 100 : N + 1 - abs;
          const shadow = isActive
            ? "0 28px 72px rgba(0,0,0,0.13), 0 10px 28px rgba(0,0,0,0.07)"
            : "0 6px 18px rgba(0,0,0,0.07), 0 2px 6px rgba(0,0,0,0.04)";

          return (
            <div
              key={theme.name}
              style={{
                position: "absolute",
                left: i * SPREAD,
                top: CARD_TOP_OFFSET,
                width: CARD_W,
                height: CARD_H,
                zIndex: z,
                transform: `translateY(${ty}px) rotate(${rot}deg) scale(${scale})`,
                transition: "transform 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.38s",
                transformOrigin: "bottom center",
                boxShadow: shadow,
                cursor: "pointer",
                borderRadius: CARD_RADIUS,
                // Solid white background prevents cards from being see-through during
                // the flip (when both faces are edge-on at 90°, the outer div shows).
                background: "white",
                // overflow: hidden clips any child content to the card bounds.
                // Safe here — card outer is NOT the parent of the preserve-3d flip inner.
                overflow: "hidden",
                // isolation: isolate guarantees a self-contained stacking context so
                // z-index ordering is never influenced by ancestor 3D rendering contexts.
                isolation: "isolate",
              }}
              onClick={() => onSelectTheme(isFiltering ? null : theme.name)}
            >
              {/* Scene: perspective must live on the PARENT of the preserve-3d element,
                  never on the same element — otherwise backface-visibility breaks. */}
              <div style={{ width: "100%", height: "100%", perspective: "900px", background: "white", borderRadius: CARD_RADIUS }}>
                {/* Flip container: preserve-3d + rotation only, no overflow/radius here */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transition: "transform 0.55s cubic-bezier(0.45, 0.05, 0.55, 0.95)",
                  }}
                >
                  {/* ── BACK FACE (default visible) — title only ── */}
                  <div style={faceStyle}>
                    <div
                      style={{
                        ...faceContentStyle,
                        background: "white",
                        border: "1px solid #e6e5e0",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "28px 24px",
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] tracking-[0.2em] font-mono" style={{ color: "#c8c7c0" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest2" style={{ color: "#d4d3cc" }}>
                          Theme
                        </span>
                      </div>

                      <div className="flex flex-col items-center text-center gap-4">
                        <div style={{ color: "#b4b3aa" }}>{ICONS[theme.name]}</div>
                        <h3 className="font-display text-xl text-ink leading-tight px-2">
                          {theme.name}
                        </h3>
                        <div className="w-8 border-t" style={{ borderColor: "#e6e5e0" }} />
                        <p className="text-[11px] text-text-gray leading-relaxed line-clamp-2 px-1">
                          {theme.description.split("—")[0].trim()}
                        </p>
                      </div>

                      <div className="flex justify-center">
                        <span
                          className="text-[10px] uppercase tracking-widest2"
                          style={{ color: isActive ? "#b0b0a8" : "transparent" }}
                        >
                          Click to reveal
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ── FRONT FACE (visible when flipped) — full content ── */}
                  <div style={{ ...faceStyle, transform: "rotateY(180deg)" }}>
                    <div
                      style={{
                        ...faceContentStyle,
                        background: "white",
                        border: "1px solid #e6e5e0",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ height: 3, background: "var(--color-accent)", flexShrink: 0 }} />

                      <div className="flex-1 flex flex-col p-6">
                        <div className="flex items-start justify-between">
                          <div style={{ color: "var(--color-accent)" }}>{ICONS[theme.name]}</div>
                          <span className="text-[10px] tracking-[0.2em] font-mono" style={{ color: "#c8c7c0" }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <h3 className="font-display text-xl text-ink leading-tight mt-4">
                          {theme.name}
                        </h3>

                        <p className="mt-3 text-sm text-text-gray leading-relaxed flex-1">
                          {theme.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {theme.keywords.map((kw) => (
                            <button
                              key={kw}
                              onClick={(e) => { e.stopPropagation(); onSelectKeyword(kw.toLowerCase()); }}
                              className="text-[10px] uppercase tracking-widest2 px-2 py-1 border border-light-gray text-text-gray hover:border-ink hover:text-ink transition-museum"
                            >
                              {kw}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="px-6 py-3 flex items-center justify-between border-t" style={{ borderColor: "#f0efea" }}>
                        <span
                          className="text-[10px] uppercase tracking-widest2"
                          style={{ color: isFiltering ? "var(--color-accent)" : "#b8b7b0" }}
                        >
                          {isFiltering ? "Filtering active" : "Click to filter"}
                        </span>
                        <div
                          className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                          style={{
                            background: isFiltering ? "var(--color-accent)" : "transparent",
                            border: isFiltering ? "none" : "1px solid #d4d3cc",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[11px] uppercase tracking-widest2 text-text-gray mt-2 opacity-60">
        Move cursor to browse · Click to reveal
      </p>
    </div>
  );
}
