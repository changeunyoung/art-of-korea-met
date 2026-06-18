"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import cloud from "d3-cloud";
import { WordFrequency } from "@/lib/types";
import { getThemeForWord, STOPWORDS } from "@/lib/textAnalysis";
import { THEMES } from "@/components/textanalysis/ThemeExplorer";

interface InteractiveWordCloudProps {
  frequencies: WordFrequency[];
  displayedTerms: number;
  onDisplayedTermsChange: (n: number) => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  selectedWord: string | null;
  onSelectWord: (word: string) => void;
  selectedTheme: string | null;
  onSelectTheme: (theme: string | null) => void;
}

const TERM_STEPS = [10, 20, 30, 50, 75, 100, 150];

// Museum-toned palette restricted to deep navy, sky blue, blue gray, soft
// gray and charcoal — assigned by importance tier (not randomly) so the
// most frequent words read as the visual anchors of the cloud.
const STRONG_COLORS = ["#1F2D3D", "#3E6FA3", "#33414F"]; // Deep Navy, Sky Blue, Charcoal
const MID_COLORS = ["#6E84A3", "#8B97A8"]; // Blue Gray, Soft Gray
const LIGHT_COLORS = ["#C3CAD3", "#D6DBE1"]; // pale Soft Gray / pale Blue Gray

const HIGHLIGHT_COLOR = "#3E6FA3";

interface CloudWord extends WordFrequency {
  x: number;
  y: number;
  rotate: number;
  fontSize: number;
  color: string;
  tier: 1 | 2 | 3;
}

interface SeedWord {
  text: string;
  value: number;
  size: number;
  x?: number;
  y?: number;
  rotate?: number;
}

function hashText(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export default function InteractiveWordCloud({
  frequencies,
  displayedTerms,
  onDisplayedTermsChange,
  searchQuery,
  onSearchQueryChange,
  selectedWord,
  onSelectWord,
  selectedTheme,
  onSelectTheme,
}: InteractiveWordCloudProps) {
  const [hovered, setHovered] = useState<WordFrequency | null>(null);
  const [themeOpen, setThemeOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [layout, setLayout] = useState<CloudWord[]>([]);
  const [exiting, setExiting] = useState<(CloudWord & { fading: boolean })[]>([]);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const exitTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const layoutMapRef = useRef<Map<string, CloudWord>>(new Map());

  const source = useMemo(() => {
    if (!selectedTheme) return frequencies;
    return frequencies.filter((f) => getThemeForWord(f.text) === selectedTheme);
  }, [frequencies, selectedTheme]);

  const query = searchQuery.trim().toLowerCase();

  // Top-N terms by frequency, plus any words elsewhere in the dataset that
  // match the current search query — so users can find and highlight a word
  // even if it falls outside the currently displayed term count.
  const displayed = useMemo(() => {
    const top = source.slice(0, displayedTerms);
    if (!query) return top;

    const topTexts = new Set(top.map((f) => f.text));
    const matches = source.filter((f) => !topTexts.has(f.text) && f.text.includes(query));
    return [...top, ...matches];
  }, [source, displayedTerms, query]);

  // Track container size responsively
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize((prev) =>
          prev.width === width && prev.height === height ? prev : { width, height }
        );
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Run a real d3-cloud (Voyant Cirrus style) layout: the full set of
  // currently-displayed terms is laid out from scratch with a spiral,
  // collision-based packing algorithm, biggest words near the center.
  // Every change to `displayed` (e.g. the Terms slider) triggers a complete
  // recalculation — no previous coordinates are reused.
  useEffect(() => {
    if (size.width === 0 || size.height === 0 || displayed.length === 0) {
      setLayout([]);
      layoutMapRef.current.clear();
      return;
    }

    const max = displayed[0].value;
    const min = displayed[displayed.length - 1].value;
    const maxFont = Math.max(28, Math.min(68, size.width / 12));
    const minFont = 11;
    const scaleFont = (value: number) => {
      if (max === min) return (maxFont + minFont) / 2;
      const ratio = (value - min) / (max - min);
      return minFont + Math.pow(ratio, 1.1) * (maxFont - minFont);
    };

    // Visual hierarchy tiers, by rank (displayed is sorted by frequency desc):
    // tier 1 — the 5-8 most important words, strong colors, always horizontal.
    // tier 2 — mid-frequency words, medium tones.
    // tier 3 — everything else, pale gray, read last.
    const topCount = Math.min(8, Math.max(5, Math.ceil(displayed.length * 0.06)), displayed.length);
    const midCount = Math.min(
      displayed.length,
      topCount + Math.ceil(displayed.length * 0.25)
    );

    const tierFor = (i: number): 1 | 2 | 3 => (i < topCount ? 1 : i < midCount ? 2 : 3);
    const colorFor = (i: number, tier: 1 | 2 | 3) => {
      if (tier === 1) return STRONG_COLORS[i % STRONG_COLORS.length];
      if (tier === 2) return MID_COLORS[i % MID_COLORS.length];
      return LIGHT_COLORS[i % LIGHT_COLORS.length];
    };

    // Reserve a little extra room beyond each word's rendered size when
    // computing collision boxes — fonts can render very slightly larger
    // than `measureText` predicts (hinting/sub-pixel differences), so this
    // safety margin guarantees the actual glyphs never touch.
    const SAFETY = 1.22;

    const seeds: SeedWord[] = displayed.map((w, i) => ({
      text: w.text,
      value: w.value,
      size: scaleFont(w.value) * (i < topCount ? 1.06 : 1) * SAFETY,
    }));

    // A slightly wide oval (museum-panel proportions): cap the spiral's
    // bounding box aspect ratio rather than letting it stretch to the full
    // container width, so the cloud reads as a calm, densely packed blob
    // instead of either a thin strip or a perfect circle.
    const aspect = 1.3;
    const cloudW = Math.min(size.width, size.height * aspect);
    const cloudH = size.height;

    const weightFor = (i: number) => {
      const tier = tierFor(i);
      return tier === 1 ? 700 : tier === 2 ? 500 : 400;
    };

    const layoutGen = cloud<SeedWord>()
      .size([cloudW, cloudH])
      .words(seeds)
      .padding(3)
      .rotate((_d, i) => {
        if (i < topCount) return 0; // largest words stay horizontal
        return hashText(_d.text ?? "") % 5 === 0 ? 90 : 0; // ~18% vertical overall
      })
      // Render with Georgia — a serif with well-behaved, predictable glyph
      // metrics (modest ascenders/descenders, no large decorative swashes).
      // d3-cloud's canvas-measured collision boxes line up tightly with the
      // rendered glyphs, so words can pack densely without overlapping.
      // (Cormorant Garamond's exaggerated swashes made measureText-based
      // boxes too small relative to what actually renders.)
      .font("Georgia")
      .fontWeight((_d, i) => weightFor(i))
      .fontSize((d) => d.size ?? minFont)
      .random(() => 0.5)
      .on("end", (placed) => {
        const displayedTexts = new Set(displayed.map((w) => w.text));
        const rankByText = new Map(displayed.map((w, i) => [w.text, i]));
        const nextMap = new Map<string, CloudWord>();

        placed.forEach((w) => {
          const text = w.text ?? "";
          const rank = rankByText.get(text) ?? displayed.length - 1;
          const tier = tierFor(rank);
          nextMap.set(text, {
            text,
            value: w.value ?? 0,
            x: w.x ?? 0,
            y: w.y ?? 0,
            rotate: w.rotate ?? 0,
            // Render slightly smaller than the collision box that was
            // measured, so the safety margin above never shows as overlap.
            fontSize: (w.size ?? minFont) / SAFETY,
            color: colorFor(rank, tier),
            tier,
          });
        });

        const prevMap = layoutMapRef.current;
        const removed: CloudWord[] = [];
        prevMap.forEach((w, text) => {
          if (!displayedTexts.has(text)) removed.push(w);
        });

        layoutMapRef.current = nextMap;
        setLayout(Array.from(nextMap.values()));

        if (removed.length > 0) {
          removed.forEach((w) => {
            const timer = setTimeout(() => {
              setExiting((prev) => prev.filter((x) => x.text !== w.text));
              exitTimers.current.delete(w.text);
            }, 600);
            exitTimers.current.set(w.text, timer);
          });
          setExiting((prev) => {
            const merged = new Map(prev.map((w) => [w.text, w]));
            removed.forEach((w) => merged.set(w.text, { ...w, fading: false }));
            return Array.from(merged.values());
          });
        }

        exitTimers.current.forEach((timer, text) => {
          if (displayedTexts.has(text)) {
            clearTimeout(timer);
            exitTimers.current.delete(text);
          }
        });
        setExiting((prev) => prev.filter((w) => !displayedTexts.has(w.text)));

        setRevealed((prev) => {
          const next = new Set(prev);
          let changed = false;
          prev.forEach((text) => {
            if (!displayedTexts.has(text)) {
              next.delete(text);
              changed = true;
            }
          });
          return changed ? next : prev;
        });
      });

    // Wait for the actual rendering font to finish loading before measuring
    // text widths — otherwise the canvas falls back to a default font on
    // first render, the collision boxes won't match the rendered glyphs,
    // and words can end up overlapping.
    let cancelled = false;
    const start = () => {
      if (!cancelled) layoutGen.start();
    };
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      layoutGen.stop();
    };
  }, [displayed, size]);

  // Trigger the fade-out transition for newly exiting words on the next frame.
  useEffect(() => {
    const pending = exiting.filter((w) => !w.fading);
    if (pending.length === 0) return;
    const raf = requestAnimationFrame(() => {
      setExiting((prev) =>
        prev.map((w) => (pending.some((p) => p.text === w.text) ? { ...w, fading: true } : w))
      );
    });
    return () => cancelAnimationFrame(raf);
  }, [exiting]);

  // Reveal newly entering words on the next frame so they fade in + scale up.
  useEffect(() => {
    const pending = layout.filter((w) => !revealed.has(w.text));
    if (pending.length === 0) return;
    const raf = requestAnimationFrame(() => {
      setRevealed((prev) => {
        const next = new Set(prev);
        pending.forEach((w) => next.add(w.text));
        return next;
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [layout, revealed]);

  const cx = size.width / 2;
  const cy = size.height / 2;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div className="flex-1 max-w-sm">
          <label className="block text-xs uppercase tracking-widest2 text-text-gray mb-2">
            Search a Word
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              onSearchQueryChange(val);
              const trimmed = val.trim().toLowerCase();
              if (trimmed && !STOPWORDS.has(trimmed) && source.some((f) => f.text === trimmed)) {
                onSelectWord(trimmed);
              }
            }}
            placeholder="e.g. Buddhist, Celadon, Goryeo"
            className="w-full border border-light-gray bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink transition-museum"
          />
        </div>

        <div className="flex-1 max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs uppercase tracking-widest2 text-text-gray">Terms</label>
            <span className="text-xs text-text-gray">{displayedTerms}</span>
          </div>
          <div className="flex items-center h-9">
            <input
              type="range"
              min={10}
              max={250}
              step={1}
              value={displayedTerms}
              onChange={(e) => onDisplayedTermsChange(Number(e.target.value))}
              className="w-full accent-ink"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-widest2 text-text-gray">
          Displaying: {displayed.length} terms · Selected Theme: {selectedTheme ?? "All Themes"}
        </p>
        <div className="relative">
          <button
            onClick={() => setThemeOpen((v) => !v)}
            className="text-[10px] uppercase tracking-widest2 px-3 py-1.5 border transition-museum flex items-center gap-2"
            style={{ borderColor: "#4a90b8", color: "#fff", backgroundColor: "#4a90b8" }}
          >
            {selectedTheme ?? "All Themes"}
            <span className="text-[8px]">▾</span>
          </button>
          {themeOpen && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-light-gray shadow-lg z-20 min-w-[180px]">
              {[null, ...THEMES.map((t) => t.name)].map((name) => (
                <button
                  key={name ?? "all"}
                  onClick={() => { onSelectTheme(name); setThemeOpen(false); }}
                  className={`w-full text-left text-[10px] uppercase tracking-widest2 px-3 py-2 transition-museum hover:bg-background-soft ${
                    selectedTheme === name ? "text-ink font-medium" : "text-text-gray"
                  }`}
                >
                  {name ?? "All Themes"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative bg-white border border-light-gray overflow-hidden min-h-[360px] md:min-h-[500px]"
      >
        {size.width > 0 && size.height > 0 && (
          <svg
            width={size.width}
            height={size.height}
            viewBox={`0 0 ${size.width} ${size.height}`}
            className="absolute inset-0"
          >
            {exiting.map((word) => (
              <text
                key={`exiting-${word.text}`}
                x={0}
                y={0}
                textAnchor="middle"
                dominantBaseline="central"
                className="select-none transition-museum"
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  transform: `translate(${cx + word.x}px, ${cy + word.y}px) rotate(${word.rotate}deg)`,
                  fontSize: `${word.fontSize}px`,
                  fill: word.color,
                  opacity: word.fading ? 0 : 1,
                  pointerEvents: "none",
                }}
              >
                {word.text}
              </text>
            ))}

            {layout.map((word) => {
              const isSelected = selectedWord === word.text;
              const isSearchMatch = query !== "" && word.text.includes(query);
              const emphasized = isSelected || isSearchMatch;
              const isRevealed = revealed.has(word.text);
              const scale = isRevealed ? 1 : 0.5;
              const opacity = isRevealed ? 1 : 0;

              return (
                <text
                  key={word.text}
                  x={0}
                  y={0}
                  textAnchor="middle"
                  dominantBaseline="central"
                  onMouseEnter={() => setHovered(word)}
                  onMouseLeave={() => setHovered((h) => (h?.text === word.text ? null : h))}
                  onClick={() => onSelectWord(word.text)}
                  className="cursor-pointer select-none transition-museum hover:opacity-80"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    transform: `translate(${cx + word.x}px, ${cy + word.y}px) rotate(${word.rotate}deg) scale(${scale})`,
                    fontSize: `${word.fontSize}px`,
                    fontWeight: emphasized ? 700 : word.tier === 1 ? 700 : word.tier === 2 ? 500 : 400,
                    fill: emphasized ? HIGHLIGHT_COLOR : word.color,
                    textDecoration: "none",
                    filter: isSelected ? "drop-shadow(0 0 6px rgba(91,127,166,0.55))" : "none",
                    opacity,
                  }}
                >
                  {word.text}
                </text>
              );
            })}
          </svg>
        )}

        {layout.length === 0 && exiting.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-text-gray text-sm">
            {displayed.length === 0 ? "No words to display for this theme." : "Loading word cloud…"}
          </p>
        )}

        {hovered && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-ink text-white text-xs px-4 py-2 whitespace-nowrap shadow-lg z-10">
            {hovered.text} / Frequency: {hovered.value} / Theme: {getThemeForWord(hovered.text) ?? "—"}
          </div>
        )}
      </div>
    </div>
  );
}
