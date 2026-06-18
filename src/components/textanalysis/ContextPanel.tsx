"use client";

import { useMemo, useState } from "react";
import { WordFrequency, LabelObject, WallText, Hotspot } from "@/lib/types";
import { getThemeForWord, findExcerpts, findRelatedObjects, findRelatedWallTexts, tokenize, STOPWORDS } from "@/lib/textAnalysis";
import WordDefinition from "./WordDefinition";
import HotspotInfoPanel from "@/components/map/HotspotInfoPanel";

interface ContextPanelProps {
  selectedWord: string | null;
  frequencies: WordFrequency[];
  fullText: string;
  objects: LabelObject[];
  wallTexts: WallText[];
  onSelectWord: (word: string) => void;
}

const INTERPRETATION_TEMPLATES: Record<string, (word: string) => string> = {
  "Dynastic History": (word) =>
    `The frequent appearance of "${word}" suggests that the Korean Gallery interprets objects primarily through historical dynasties and periods, situating works within Korea's royal and political history rather than around individual makers.`,
  "Materials & Techniques": (word) =>
    `The frequent appearance of "${word}" suggests that the Korean Gallery often interprets Korean art through material traditions, ceramic technology, and craftsmanship rather than individual artistic authorship.`,
  "Religion & Ritual": (word) =>
    `The frequent appearance of "${word}" suggests that the Korean Gallery frames many objects through religious meaning and ritual function, using Buddhist belief and ceremony as a key interpretive lens.`,
  "Everyday Life & Function": (word) =>
    `The frequent appearance of "${word}" suggests that the Korean Gallery explains many objects through their everyday use and social function, connecting them to daily life and household culture.`,
  "Collecting History": (word) =>
    `The frequent appearance of "${word}" suggests that the Korean Gallery foregrounds the history of collecting itself, showing how donors, funds, and acquisitions shaped the Met's Korean collection.`,
  "Cultural Identity": (word) =>
    `The frequent appearance of "${word}" suggests that the Korean Gallery repeatedly emphasizes the continuity of Korean culture, tradition, and identity across time.`,
};

function highlightWord(text: string, word: string) {
  const pattern = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    part.toLowerCase() === word.toLowerCase() ? (
      <mark key={i} className="bg-accent text-ink px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function ClickableExcerpt({ text, selectedWord, onSelectWord }: { text: string; selectedWord: string; onSelectWord: (w: string) => void }) {
  // Split into alternating word / non-word segments
  const wordPattern = new RegExp(`\\b${selectedWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  const parts = text.split(/(\b[a-zA-Z0-9]+\b)/g);
  return (
    <>
      {parts.map((part, i) => {
        const isWord = /^[a-zA-Z0-9]+$/.test(part);
        if (!isWord) return <span key={i}>{part}</span>;
        const isSelected = wordPattern.test(part);
        const isStopword = STOPWORDS.has(part.toLowerCase());
        if (isSelected) {
          return (
            <mark key={i} className="bg-accent text-ink px-0.5 cursor-pointer" onClick={() => onSelectWord(part.toLowerCase())}>
              {part}
            </mark>
          );
        }
        if (isStopword) {
          return <span key={i}>{part}</span>;
        }
        return (
          <span
            key={i}
            onClick={() => onSelectWord(part.toLowerCase())}
            className="cursor-pointer hover:underline hover:text-ink transition-museum"
          >
            {part}
          </span>
        );
      })}
    </>
  );
}

const EXCERPTS_PER_PAGE = 10;
const OBJECTS_PER_PAGE = 3;
const WALL_TEXTS_PER_PAGE = 3;

function labelObjectToHotspot(obj: LabelObject): Hotspot {
  return {
    id: obj.id,
    x: 0, y: 0,
    type: "object",
    label: String(obj.number ?? ""),
    objectName: obj.name,
    objectNumber: String(obj.number ?? ""),
    period: obj.period,
    description: obj.description,
    curatorialInterpretation: "",
    keywords: [],
    koreanName: obj.koreanName,
    metUrl: obj.url,
  };
}

function wallTextToHotspot(wt: WallText): Hotspot {
  return {
    id: wt.id,
    x: 0, y: 0,
    type: "wallText",
    label: wt.label,
    objectName: wt.title,
    objectNumber: "",
    period: "",
    description: wt.text,
    curatorialInterpretation: "",
    keywords: [],
  };
}

export default function ContextPanel({ selectedWord, frequencies, fullText, objects, wallTexts, onSelectWord }: ContextPanelProps) {
  const [excerptPage, setExcerptPage] = useState(0);
  const [objectPage, setObjectPage] = useState(0);
  const [wallTextPage, setWallTextPage] = useState(0);
  const [modalHotspot, setModalHotspot] = useState<Hotspot | null>(null);

  const theme = useMemo(() => (selectedWord ? getThemeForWord(selectedWord) : null), [selectedWord]);

  const excerpts = useMemo(() => {
    setExcerptPage(0);
    setObjectPage(0);
    setWallTextPage(0);
    return selectedWord ? findExcerpts(fullText, selectedWord) : [];
  }, [fullText, selectedWord]);

  const frequency = useMemo(() => {
    if (!selectedWord) return 0;
    const pattern = new RegExp(`\\b${selectedWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    return (fullText.match(pattern) ?? []).length;
  }, [fullText, selectedWord]);

  const relatedObjects = useMemo(
    () => (selectedWord ? findRelatedObjects(objects, selectedWord) : []),
    [objects, selectedWord]
  );

  const relatedWallTexts = useMemo(
    () => (selectedWord ? findRelatedWallTexts(wallTexts, selectedWord) : []),
    [wallTexts, selectedWord]
  );

  const relatedKeywords = useMemo(() => {
    if (!selectedWord || excerpts.length === 0) return [];
    const counts = new Map<string, number>();
    const freqLookup = new Set(frequencies.map((f) => f.text));
    for (const excerpt of excerpts) {
      const tokens = new Set(tokenize(excerpt));
      for (const token of tokens) {
        if (token === selectedWord.toLowerCase()) continue;
        if (STOPWORDS.has(token)) continue;
        if (!freqLookup.has(token)) continue;
        counts.set(token, (counts.get(token) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word]) => word);
  }, [selectedWord, excerpts, frequencies]);

  if (!selectedWord) {
    return (
      <div className="mt-6 bg-background-soft border border-light-gray px-8 py-12 text-center animate-fadeInSlow">
        <p className="text-text-gray">
          Click a word to explore its context.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white border border-light-gray p-6 md:p-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-light-gray pb-6 mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest2 text-text-gray mb-2">Selected Word</p>
          <h3 className="font-display text-3xl text-ink capitalize">{selectedWord}</h3>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-xs uppercase tracking-widest2 text-text-gray mb-2">Frequency</p>
            <p className="text-lg text-ink">{frequency} occurrences</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest2 text-text-gray mb-2">Theme</p>
            <p className="text-lg text-ink">{theme ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* Row 1: Label Contexts (left) + Related Objects & Wall Texts (right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Label Contexts */}
        <div>
          <p className="group relative text-xs uppercase tracking-widest2 text-text-gray mb-3 cursor-default">
            <span className="transition-museum group-hover:opacity-0">
              In Context
              {frequency > 0 && (
                <span className="ml-2 normal-case tracking-normal">({frequency})</span>
              )}
            </span>
            <span className="absolute inset-x-0 left-0 opacity-0 transition-museum group-hover:opacity-100 normal-case break-words">
              Where this word appears in the gallery texts
            </span>
          </p>
          {excerpts.length > 0 ? (
            <>
              <ul className="space-y-3">
                {excerpts.slice(excerptPage * EXCERPTS_PER_PAGE, (excerptPage + 1) * EXCERPTS_PER_PAGE).map((excerpt, i) => (
                  <li key={excerptPage * EXCERPTS_PER_PAGE + i} className="text-sm text-ink leading-relaxed border-l-2 border-accent pl-3">
                    &ldquo;...<ClickableExcerpt text={excerpt} selectedWord={selectedWord} onSelectWord={onSelectWord} />...&rdquo;
                  </li>
                ))}
              </ul>
              {excerpts.length > EXCERPTS_PER_PAGE && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-light-gray">
                  <button
                    onClick={() => setExcerptPage((p) => Math.max(0, p - 1))}
                    disabled={excerptPage === 0}
                    className="text-xs uppercase tracking-widest2 px-3 py-1 border border-light-gray text-text-gray hover:border-ink hover:text-ink transition-museum disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← Prev
                  </button>
                  <span className="text-xs text-text-gray">
                    {excerptPage + 1} / {Math.ceil(excerpts.length / EXCERPTS_PER_PAGE)}
                  </span>
                  <button
                    onClick={() => setExcerptPage((p) => Math.min(Math.ceil(excerpts.length / EXCERPTS_PER_PAGE) - 1, p + 1))}
                    disabled={excerptPage >= Math.ceil(excerpts.length / EXCERPTS_PER_PAGE) - 1}
                    className="text-xs uppercase tracking-widest2 px-3 py-1 border border-light-gray text-text-gray hover:border-ink hover:text-ink transition-museum disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-text-gray">No label excerpts found for this word.</p>
          )}
        </div>

        {/* Right: Related Objects + Related Wall Texts */}
        <div className="space-y-6">
          <div>
            <p className="group relative text-xs uppercase tracking-widest2 text-text-gray mb-3 cursor-default">
              <span className="transition-museum group-hover:opacity-0">
                Related Objects
                {relatedObjects.length > 0 && (
                  <span className="ml-2 normal-case tracking-normal">({relatedObjects.length})</span>
                )}
              </span>
              <span className="absolute inset-x-0 left-0 opacity-0 transition-museum group-hover:opacity-100 normal-case break-words">
                Object labels that mention this word
              </span>
            </p>
            {relatedObjects.length > 0 ? (
              <>
                <ul className="space-y-2">
                  {relatedObjects.slice(objectPage * OBJECTS_PER_PAGE, (objectPage + 1) * OBJECTS_PER_PAGE).map((obj) => (
                    <li key={obj.id} className="border border-light-gray p-3 transition-museum hover:border-ink cursor-pointer" onClick={() => setModalHotspot(labelObjectToHotspot(obj))}>
                      <div className="flex items-start gap-2">
                        {obj.number != null && (
                          <span className="shrink-0 text-[10px] uppercase tracking-widest2 border border-light-gray px-1.5 py-0.5 text-text-gray mt-0.5">{obj.number}</span>
                        )}
                        <div>
                          <p className="text-sm text-ink leading-snug">{obj.name}</p>
                          <p className="text-xs text-text-gray mt-0.5">
                            {obj.period}{obj.material ? ` · ${obj.material}` : ""}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {relatedObjects.length > OBJECTS_PER_PAGE && (
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-light-gray">
                    <button
                      onClick={() => setObjectPage((p) => Math.max(0, p - 1))}
                      disabled={objectPage === 0}
                      className="text-xs uppercase tracking-widest2 px-3 py-1 border border-light-gray text-text-gray hover:border-ink hover:text-ink transition-museum disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>
                    <span className="text-xs text-text-gray">
                      {objectPage + 1} / {Math.ceil(relatedObjects.length / OBJECTS_PER_PAGE)}
                    </span>
                    <button
                      onClick={() => setObjectPage((p) => Math.min(Math.ceil(relatedObjects.length / OBJECTS_PER_PAGE) - 1, p + 1))}
                      disabled={objectPage >= Math.ceil(relatedObjects.length / OBJECTS_PER_PAGE) - 1}
                      className="text-xs uppercase tracking-widest2 px-3 py-1 border border-light-gray text-text-gray hover:border-ink hover:text-ink transition-museum disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-text-gray">No object labels contain this word.</p>
            )}
          </div>

          <div>
            <p className="group relative text-xs uppercase tracking-widest2 text-text-gray mb-3 cursor-default">
              <span className="transition-museum group-hover:opacity-0">
                Related Wall Texts
                {relatedWallTexts.length > 0 && (
                  <span className="ml-2 normal-case tracking-normal">({relatedWallTexts.length})</span>
                )}
              </span>
              <span className="absolute inset-x-0 left-0 opacity-0 transition-museum group-hover:opacity-100 normal-case break-words">
                Gallery wall texts that mention this word
              </span>
            </p>
            {relatedWallTexts.length > 0 ? (
              <>
                <ul className="space-y-3">
                  {relatedWallTexts.slice(wallTextPage * WALL_TEXTS_PER_PAGE, (wallTextPage + 1) * WALL_TEXTS_PER_PAGE).map((wt) => (
                    <li key={wt.id} className="border border-light-gray p-3 transition-museum hover:border-ink cursor-pointer" onClick={() => setModalHotspot(wallTextToHotspot(wt))}>
                      <div className="flex items-start gap-2">
                        <span className="shrink-0 text-[10px] uppercase tracking-widest2 border border-light-gray px-1.5 py-0.5 text-text-gray mt-0.5">{wt.label}</span>
                        <div>
                          <p className="text-sm text-ink leading-snug">{wt.title}</p>
                          <p className="text-xs text-text-gray mt-1 leading-relaxed line-clamp-3">
                            {highlightWord(wt.text.slice(0, 200) + (wt.text.length > 200 ? "…" : ""), selectedWord)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {relatedWallTexts.length > WALL_TEXTS_PER_PAGE && (
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-light-gray">
                    <button
                      onClick={() => setWallTextPage((p) => Math.max(0, p - 1))}
                      disabled={wallTextPage === 0}
                      className="text-xs uppercase tracking-widest2 px-3 py-1 border border-light-gray text-text-gray hover:border-ink hover:text-ink transition-museum disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>
                    <span className="text-xs text-text-gray">
                      {wallTextPage + 1} / {Math.ceil(relatedWallTexts.length / WALL_TEXTS_PER_PAGE)}
                    </span>
                    <button
                      onClick={() => setWallTextPage((p) => Math.min(Math.ceil(relatedWallTexts.length / WALL_TEXTS_PER_PAGE) - 1, p + 1))}
                      disabled={wallTextPage >= Math.ceil(relatedWallTexts.length / WALL_TEXTS_PER_PAGE) - 1}
                      className="text-xs uppercase tracking-widest2 px-3 py-1 border border-light-gray text-text-gray hover:border-ink hover:text-ink transition-museum disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-text-gray">No wall texts contain this word.</p>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Definition (full width) */}
      <WordDefinition word={selectedWord} />

      {/* Row 3: Interpretation (full width) */}
      <div className="mt-8 pt-8 border-t border-light-gray">
        <p className="text-xs uppercase tracking-widest2 text-text-gray mb-3">Interpretation</p>
        <p className="text-sm text-ink leading-relaxed bg-background-soft p-4 border border-light-gray">
          {theme
            ? INTERPRETATION_TEMPLATES[theme](selectedWord)
            : `The word "${selectedWord}" appears ${frequency} times across the Korean Gallery's object labels.`}
        </p>
      </div>

      {/* Row 4: Related Keywords (full width) */}
      {relatedKeywords.length > 0 && (
        <div className="mt-6">
          <p className="text-xs uppercase tracking-widest2 text-text-gray mb-3">Related Keywords</p>
          <div className="flex flex-wrap gap-2">
            {relatedKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => onSelectWord(kw)}
                className="text-xs uppercase tracking-widest2 px-3 py-1 border border-light-gray text-text-gray hover:border-ink hover:text-ink transition-museum"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hotspot detail modal */}
      {modalHotspot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm"
          onClick={() => setModalHotspot(null)}
        >
          <div
            className="relative bg-white w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <HotspotInfoPanel hotspot={modalHotspot} onClose={() => setModalHotspot(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
