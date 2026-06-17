"use client";

import { useEffect, useState } from "react";

interface DefinitionResult {
  text: string;
  partOfSpeech?: string;
  source: string;
  sourceUrl?: string;
}

// Known terms, persons, and proper nouns specific to the Korean Gallery / Met context
const KNOWN_TERMS: Record<string, DefinitionResult> = {
  korean: {
    text: "Of or relating to Korea, its people, language, or culture. Korea is a peninsula in East Asia with a recorded history spanning over two thousand years, encompassing the Three Kingdoms period, the Goryeo dynasty, the Joseon dynasty, and the modern division into North and South Korea. Korean art encompasses a wide range of traditions including ceramics, metalwork, Buddhist sculpture, painting, and textiles.",
    source: "Korean History Reference",
  },
  korea: {
    text: "A peninsula in East Asia bordered by China to the northwest and Russia to the northeast, and separated from Japan by the Korea Strait. Korea has a recorded history of over two thousand years and developed a distinct cultural identity through the Three Kingdoms period (57 BCE–668 CE), the Goryeo dynasty (918–1392), and the Joseon dynasty (1392–1910). Since 1945, the peninsula has been divided into North Korea and South Korea.",
    source: "Korean History Reference",
  },
  kun: {
    text: "Kun-Hee Lee (이건희, 1942–2020) was the chairman of Samsung Group and one of South Korea's most influential business leaders. A devoted art collector, he amassed one of the most significant private art collections in Asia. The Kun-Hee Lee Fund for Korean Art at The Metropolitan Museum of Art was established in his honor to support the acquisition and display of Korean art.",
    source: "The Metropolitan Museum of Art",
    sourceUrl: "https://www.metmuseum.org",
  },
  hee: {
    text: "Kun-Hee Lee (이건희, 1942–2020) was the chairman of Samsung Group and one of South Korea's most influential business leaders. A devoted art collector, he amassed one of the most significant private art collections in Asia. The Kun-Hee Lee Fund for Korean Art at The Metropolitan Museum of Art was established in his honor to support the acquisition and display of Korean art.",
    source: "The Metropolitan Museum of Art",
    sourceUrl: "https://www.metmuseum.org",
  },
  lee: {
    text: "Kun-Hee Lee (이건희, 1942–2020) was the chairman of Samsung Group and one of South Korea's most influential business leaders. A devoted art collector, he amassed one of the most significant private art collections in Asia. The Kun-Hee Lee Fund for Korean Art at The Metropolitan Museum of Art was established in his honor to support the acquisition and display of Korean art.",
    source: "The Metropolitan Museum of Art",
    sourceUrl: "https://www.metmuseum.org",
  },
  met: {
    text: "The Metropolitan Museum of Art (The Met), founded in 1870, is one of the world's largest and most visited art museums. Located in New York City, its collection spans over 5,000 years of art from cultures around the world, including the Korean Gallery which presents objects from prehistoric times to the present.",
    source: "The Metropolitan Museum of Art",
    sourceUrl: "https://www.metmuseum.org/about-the-met",
  },
  rogers: {
    text: "Jacob S. Rogers (1840–1901) was an American locomotive manufacturer who bequeathed approximately $5 million to The Metropolitan Museum of Art upon his death. The Rogers Fund, established from his estate in 1901, has since been used to purchase thousands of works of art for the Museum's collection, including many objects in the Korean Gallery.",
    source: "The Metropolitan Museum of Art",
    sourceUrl: "https://www.metmuseum.org",
  },
};

// Key years in Korean history that may appear in the word cloud
const KOREAN_HISTORY_YEARS: Record<string, string> = {
  "57": "Traditional founding date of the Silla kingdom (57 BCE), one of the Three Kingdoms of Korea, which unified the peninsula in the 7th century.",
  "372": "Buddhism was officially introduced to the Goguryeo kingdom (372 CE), spreading from the Northern Former Qin state. It subsequently spread to Baekje and Silla.",
  "527": "Buddhism was officially adopted by the Silla kingdom (527 CE) following the martyrdom of Ichadon, marking a turning point in the religion's spread across the peninsula.",
  "676": "Silla unified the Korean peninsula (676 CE) after defeating Goguryeo and Baekje with Tang Dynasty support, beginning the Unified Silla period.",
  "918": "Wang Geon founded the Goryeo dynasty (918 CE), unifying the Later Three Kingdoms and establishing a Buddhist-influenced state that would last until 1392.",
  "935": "The last Silla king surrendered to Goryeo (935 CE), ending over nine centuries of Silla rule.",
  "936": "Goryeo completed the unification of the Korean peninsula (936 CE) by defeating Later Baekje.",
  "1392": "Yi Seonggye overthrew the Goryeo dynasty and founded the Joseon dynasty (1392 CE), which adopted Neo-Confucianism as its state ideology. The Joseon dynasty lasted until 1910.",
  "1446": "King Sejong the Great promulgated Hangul (1446 CE), the Korean alphabet, to improve literacy among the Korean people.",
  "1592": "Japan invaded Korea (1592 CE), beginning the Imjin War (1592–1598). The invasions caused widespread destruction of cultural heritage and population displacement.",
  "1700": "Mid-Joseon period (ca. 1700 CE). Neo-Confucianism dominated court culture; Buddhist arts continued to be produced in monasteries despite reduced royal patronage.",
  "1876": "Japan forced Korea to sign the Japan–Korea Treaty of Amity (1876 CE), opening Korean ports and beginning a period of Japanese political and economic influence.",
  "1897": "King Gojong proclaimed the Korean Empire (1897 CE), renaming the Joseon dynasty and asserting Korean sovereignty in the face of foreign pressure.",
  "1910": "Japan formally annexed Korea through the Japan–Korea Annexation Treaty (1910 CE), ending the Joseon dynasty and beginning 35 years of Japanese colonial rule.",
  "1919": "The March First Movement (1919 CE) was a nationwide nonviolent protest against Japanese colonial rule, becoming a landmark event in the Korean independence movement.",
  "1945": "Korea was liberated from Japanese colonial rule (1945 CE) following Japan's defeat in World War II, but the peninsula was divided at the 38th parallel into U.S. and Soviet occupation zones.",
  "1950": "The Korean War began (1950 CE) when North Korea invaded South Korea, drawing in United Nations forces and lasting until the 1953 armistice.",
};

function isYear(word: string): boolean {
  return /^\d{3,4}$/.test(word);
}

async function fetchDefinition(word: string): Promise<DefinitionResult | null> {
  // Known terms / gallery-specific proper nouns
  if (KNOWN_TERMS[word.toLowerCase()]) {
    return KNOWN_TERMS[word.toLowerCase()];
  }

  // Year: return Korean historical context
  if (isYear(word)) {
    const hist = KOREAN_HISTORY_YEARS[word];
    if (hist) {
      return { text: hist, source: "Korean History Reference" };
    }
    return null;
  }

  // Try Free Dictionary API (based on Wiktionary)
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    );
    if (res.ok) {
      const data = await res.json();
      const entry = data[0];
      const meaning = entry?.meanings?.[0];
      const def = meaning?.definitions?.[0];
      if (def?.definition) {
        return {
          text: def.definition,
          partOfSpeech: meaning.partOfSpeech,
          source: "Wiktionary",
          sourceUrl: `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`,
        };
      }
    }
  } catch {
    // fall through to Wikipedia
  }

  // Fallback: Wikipedia (for proper nouns, place names, dynasty names, etc.)
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(word)}`
    );
    if (res.ok) {
      const data = await res.json();
      if (data.extract && data.type !== "disambiguation") {
        // Limit to first 2 sentences
        const sentences = data.extract.match(/[^.!?]+[.!?]+/g) ?? [data.extract];
        const excerpt = sentences.slice(0, 2).join(" ").trim();
        return {
          text: excerpt,
          source: "Wikipedia",
          sourceUrl: data.content_urls?.desktop?.page,
        };
      }
    }
  } catch {
    // no result
  }

  return null;
}

interface WordDefinitionProps {
  word: string;
}

export default function WordDefinition({ word }: WordDefinitionProps) {
  const [definition, setDefinition] = useState<DefinitionResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!word) return;
    setDefinition(null);
    setLoading(true);

    fetchDefinition(word)
      .then(setDefinition)
      .finally(() => setLoading(false));
  }, [word]);

  if (loading) {
    return (
      <div className="mt-8 pt-8 border-t border-light-gray animate-pulse">
        <div className="h-2.5 bg-light-gray rounded w-1/4 mb-3" />
        <div className="bg-background-soft border border-light-gray p-4 space-y-2">
          <div className="h-2.5 bg-light-gray rounded w-full" />
          <div className="h-2.5 bg-light-gray rounded w-4/5" />
        </div>
      </div>
    );
  }

  if (!definition) return null;

  const isYearResult = isYear(word);
  const label = isYearResult ? "Korean Historical Context" : "Definition";

  return (
    <div className="mt-8 pt-8 border-t border-light-gray">
      <p className="text-xs uppercase tracking-widest2 text-text-gray mb-3">
        {label}
      </p>
      <p className="text-sm text-ink leading-relaxed bg-background-soft p-4 border border-light-gray">
        {definition.text}
      </p>
      {definition.source && (
        <p className="text-[10px] text-text-gray mt-1.5 tracking-wide">
          Source:{" "}
          {definition.sourceUrl ? (
            <a
              href={definition.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-ink transition-museum"
            >
              {definition.source}
            </a>
          ) : (
            definition.source
          )}
        </p>
      )}
    </div>
  );
}
