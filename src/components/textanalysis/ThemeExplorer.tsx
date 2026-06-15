"use client";

import clsx from "clsx";

export interface ThemeDefinition {
  name: string;
  description: string;
  keywords: string[];
}

export const THEMES: ThemeDefinition[] = [
  {
    name: "Dynastic History",
    description:
      "How the gallery situates objects within the flow of historical periods and royal dynasties.",
    keywords: ["dynasty", "Goryeo", "Joseon", "century", "period", "historical"],
  },
  {
    name: "Materials & Techniques",
    description: "Language that foregrounds materials and the techniques used to make objects.",
    keywords: ["bronze", "celadon", "glaze", "inlaid", "porcelain", "stoneware", "silver", "incised", "openwork"],
  },
  {
    name: "Religion & Ritual",
    description: "Language emphasizing religious meaning and ritual function.",
    keywords: ["Buddhist", "temple", "ritual", "offering", "consecration", "Sanskrit"],
  },
  {
    name: "Everyday Life & Function",
    description: "Language describing how objects were used in daily life.",
    keywords: ["mirror", "bowl", "vessel", "jar", "seal", "box", "container"],
  },
  {
    name: "Collecting History",
    description: "Language showing how the Met's Korean collection was formed through collecting.",
    keywords: ["gift", "purchase", "collection", "fund", "foundation", "Rogers", "acquisition"],
  },
  {
    name: "Cultural Identity",
    description: "Language describing Korean culture and tradition.",
    keywords: ["Korean", "culture", "tradition", "heritage", "identity", "society"],
  },
];

const ICONS: Record<string, JSX.Element> = {
  "Dynastic History": (
    <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 24h20M8 24V14l8-6 8 6v10" strokeLinejoin="round" />
      <path d="M13 24v-6h6v6" strokeLinejoin="round" />
    </svg>
  ),
  "Materials & Techniques": (
    <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 6h8l2 4-3 14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2L10 10z" strokeLinejoin="round" />
      <path d="M11 12h10" />
    </svg>
  ),
  "Religion & Ritual": (
    <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="16" cy="13" r="5" />
      <path d="M16 18v8M9 26h14M11 22c2-2 8-2 10 0" strokeLinecap="round" />
    </svg>
  ),
  "Everyday Life & Function": (
    <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 14h20l-2 8a4 4 0 0 1-4 3H12a4 4 0 0 1-4-3z" strokeLinejoin="round" />
      <path d="M11 14a5 5 0 0 1 10 0" />
    </svg>
  ),
  "Collecting History": (
    <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="6" width="20" height="20" rx="1" />
      <circle cx="12" cy="13" r="2" />
      <path d="M6 22l5-5 4 4 5-6 6 7" strokeLinejoin="round" />
    </svg>
  ),
  "Cultural Identity": (
    <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="16" cy="16" r="10" />
      <path d="M16 6v20M6 16h20" />
    </svg>
  ),
};

interface ThemeExplorerProps {
  selectedTheme: string | null;
  onSelectTheme: (theme: string | null) => void;
  onSelectKeyword: (keyword: string) => void;
}

export default function ThemeExplorer({ selectedTheme, onSelectTheme, onSelectKeyword }: ThemeExplorerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-light-gray border border-light-gray">
      {THEMES.map((theme) => {
        const isSelected = selectedTheme === theme.name;
        return (
          <button
            key={theme.name}
            onClick={() => onSelectTheme(isSelected ? null : theme.name)}
            className={clsx(
              "text-left bg-white p-6 transition-museum hover:shadow-lg hover:scale-[1.015] hover:z-10 relative",
              isSelected && "bg-background-soft ring-1 ring-inset ring-accent"
            )}
          >
            <div className="text-ink">{ICONS[theme.name]}</div>
            <h3 className="mt-4 font-serif text-lg text-ink">{theme.name}</h3>
            <p className="mt-2 text-sm text-text-gray leading-relaxed">{theme.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {theme.keywords.map((kw) => (
                <span
                  key={kw}
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectKeyword(kw.toLowerCase());
                  }}
                  className="text-xs uppercase tracking-widest2 px-2 py-1 border border-light-gray text-text-gray hover:border-ink hover:text-ink transition-museum"
                >
                  {kw}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
