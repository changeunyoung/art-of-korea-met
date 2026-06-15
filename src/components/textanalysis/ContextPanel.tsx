"use client";

import { useMemo } from "react";
import { WordFrequency, LabelObject } from "@/lib/types";
import { getThemeForWord, findExcerpts, findRelatedObjects, tokenize, STOPWORDS } from "@/lib/textAnalysis";

interface ContextPanelProps {
  selectedWord: string | null;
  frequencies: WordFrequency[];
  fullText: string;
  objects: LabelObject[];
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

export default function ContextPanel({ selectedWord, frequencies, fullText, objects, onSelectWord }: ContextPanelProps) {
  const frequency = useMemo(
    () => frequencies.find((f) => f.text === selectedWord?.toLowerCase())?.value ?? 0,
    [frequencies, selectedWord]
  );

  const theme = useMemo(() => (selectedWord ? getThemeForWord(selectedWord) : null), [selectedWord]);

  const excerpts = useMemo(
    () => (selectedWord ? findExcerpts(fullText, selectedWord, 8) : []),
    [fullText, selectedWord]
  );

  const relatedObjects = useMemo(
    () => (selectedWord ? findRelatedObjects(objects, selectedWord) : []),
    [objects, selectedWord]
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
          Select a word from the Word Cloud to explore its meaning, context, and related objects.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white border border-light-gray p-6 md:p-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-light-gray pb-6 mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest2 text-text-gray mb-2">Selected Word</p>
          <h3 className="font-serif text-3xl text-ink capitalize">{selectedWord}</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-xs uppercase tracking-widest2 text-text-gray mb-3">Label Contexts</p>
          {excerpts.length > 0 ? (
            <ul className="space-y-3">
              {excerpts.map((excerpt, i) => (
                <li key={i} className="text-sm text-ink leading-relaxed border-l-2 border-accent pl-3">
                  &ldquo;...{highlightWord(excerpt, selectedWord)}...&rdquo;
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-gray">No label excerpts found for this word.</p>
          )}

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
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-text-gray mb-3">Related Objects</p>
          {relatedObjects.length > 0 ? (
            <ul className="space-y-3">
              {relatedObjects.slice(0, 6).map((obj) => (
                <li key={obj.id} className="border border-light-gray p-3 transition-museum hover:border-ink">
                  <p className="text-sm text-ink">{obj.name}</p>
                  <p className="text-xs text-text-gray mt-1">
                    {obj.period}{obj.material ? ` · ${obj.material}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-gray">No related objects found for this word.</p>
          )}

          <div className="mt-6">
            <p className="text-xs uppercase tracking-widest2 text-text-gray mb-3">Interpretation</p>
            <p className="text-sm text-ink leading-relaxed bg-background-soft p-4 border border-light-gray">
              {theme
                ? INTERPRETATION_TEMPLATES[theme](selectedWord)
                : `The word "${selectedWord}" appears ${frequency} times across the Korean Gallery's object labels.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
