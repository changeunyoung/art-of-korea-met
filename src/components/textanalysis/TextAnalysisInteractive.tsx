"use client";

import { useEffect, useMemo, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import StatsOverview from "@/components/textanalysis/StatsOverview";
import InteractiveWordCloud from "@/components/textanalysis/InteractiveWordCloud";
import ContextPanel from "@/components/textanalysis/ContextPanel";
import TopKeywordsChart from "@/components/textanalysis/TopKeywordsChart";
import ThemeExplorer from "@/components/textanalysis/ThemeExplorer";
import FinalInsightPanel from "@/components/textanalysis/FinalInsightPanel";
import {
  loadDefaultFrequencies,
  loadLabelFullText,
  loadLabelObjects,
  loadWallTexts,
  getThemeForWord,
  tokenize,
} from "@/lib/textAnalysis";
import { WordFrequency, LabelObject, WallText } from "@/lib/types";

export default function TextAnalysisInteractive() {
  const [frequencies, setFrequencies] = useState<WordFrequency[]>([]);
  const [fullText, setFullText] = useState("");
  const [objects, setObjects] = useState<LabelObject[]>([]);
  const [wallTexts, setWallTexts] = useState<WallText[]>([]);
  const [displayedTerms, setDisplayedTerms] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  useEffect(() => {
    loadDefaultFrequencies().then(setFrequencies).catch(() => {});
    loadLabelFullText().then(setFullText).catch(() => {});
    loadLabelObjects<LabelObject>().then(setObjects).catch(() => {});
    loadWallTexts<WallText>().then(setWallTexts).catch(() => {});
  }, []);

  const handleSelectWord = (word: string) => setSelectedWord(word.toLowerCase());
  const handleSelectTheme = (theme: string | null) => setSelectedTheme(theme);

  const topKeywordFrequencies = useMemo(() => {
    if (!selectedTheme) return frequencies;
    return frequencies.filter((f) => getThemeForWord(f.text) === selectedTheme);
  }, [frequencies, selectedTheme]);

  const totalLabels = 52;
  const totalWords = useMemo(() => tokenize(fullText).length, [fullText]);
  const uniqueWords = frequencies.length;

  return (
    <>
      <p className="mt-6 max-w-2xl font-borel leading-snug text-2xl md:text-3xl" style={{ color: "#4A90B8" }}>
        How Does Art of Korea Describe Korean Art?
      </p>

      <div className="mt-12 space-y-16">
        <section id="stats">
          <StatsOverview totalLabels={totalLabels} totalWords={totalWords} uniqueWords={uniqueWords} />
        </section>

        <div className="flex justify-center">
          <img src="/images/divider-2.png" alt="" className="w-full max-w-2xl" style={{ filter: "sepia(1) hue-rotate(175deg) saturate(0.6) brightness(0.55) opacity(0.7)" }} />
        </div>

        <section id="word-cloud">
          <SectionHeading title="Word Cloud" description="A visual overview of the most prominent words found in Art of Korea's object labels." />
          <div className="mt-8">
            <InteractiveWordCloud
              frequencies={frequencies}
              displayedTerms={displayedTerms}
              onDisplayedTermsChange={setDisplayedTerms}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              selectedWord={selectedWord}
              onSelectWord={handleSelectWord}
              selectedTheme={selectedTheme}
              onSelectTheme={handleSelectTheme}
            />
            <ContextPanel selectedWord={selectedWord} frequencies={frequencies} fullText={fullText} objects={objects} wallTexts={wallTexts} onSelectWord={handleSelectWord} />
          </div>
        </section>

        <div className="flex justify-center">
          <img src="/images/divider-2.png" alt="" className="w-full max-w-2xl" style={{ filter: "sepia(1) hue-rotate(175deg) saturate(0.6) brightness(0.55) opacity(0.7)" }} />
        </div>

        <section id="top-keywords">
          <SectionHeading title="Top Keywords" description="The most frequently occurring words across Art of Korea's object labels." />
          <div className="mt-8">
            <TopKeywordsChart frequencies={topKeywordFrequencies} selectedWord={selectedWord} onSelectWord={handleSelectWord} />
          </div>
        </section>

        <div className="flex justify-center">
          <img src="/images/divider-2.png" alt="" className="w-full max-w-2xl" style={{ filter: "sepia(1) hue-rotate(175deg) saturate(0.6) brightness(0.55) opacity(0.7)" }} />
        </div>

        <section id="theme-explorer">
          <SectionHeading title="Theme Explorer" description="Six thematic lenses through which Art of Korea frames and interprets its objects. Select a theme to filter the analysis above." />
          <div className="mt-8">
            <ThemeExplorer selectedTheme={selectedTheme} onSelectTheme={handleSelectTheme} onSelectKeyword={handleSelectWord} />
          </div>
        </section>

      </div>

      <div className="mt-28 -mx-6 md:-mx-10">
        <FinalInsightPanel />
      </div>
    </>
  );
}
