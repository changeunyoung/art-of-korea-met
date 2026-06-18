"use client";

import { useEffect, useMemo, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import StatsOverview from "@/components/textanalysis/StatsOverview";
import InteractiveWordCloud from "@/components/textanalysis/InteractiveWordCloud";
import ContextPanel from "@/components/textanalysis/ContextPanel";
import TopKeywordsChart from "@/components/textanalysis/TopKeywordsChart";
import ThemeExplorer from "@/components/textanalysis/ThemeExplorer";
import CuratorialInterpretation from "@/components/textanalysis/CuratorialInterpretation";
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
      <p className="mt-6 max-w-2xl text-text-gray leading-relaxed text-base md:text-lg">
        This section explores the language used throughout the Korean Gallery&rsquo;s object
        labels. By analyzing recurring words, themes, and patterns, visitors can discover how
        curatorial language shapes the interpretation of Korean art, history, religion,
        craftsmanship, and cultural identity.
      </p>

      <div className="mt-12 space-y-16">
        <section id="stats">
          <StatsOverview totalLabels={totalLabels} totalWords={totalWords} uniqueWords={uniqueWords} />
        </section>

        <div className="flex justify-center">
          <img src="/images/divider-2.png" alt="" className="w-full max-w-2xl" style={{ filter: "sepia(1) hue-rotate(175deg) saturate(0.6) brightness(0.55) opacity(0.7)" }} />
        </div>

        <section id="word-cloud">
          <SectionHeading title="Word Cloud" description="The most frequently used words in the Korean Gallery's object labels." />
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
          <SectionHeading title="Top Keywords" description="Most frequently occurring words across the Korean Gallery labels." />
          <div className="mt-8">
            <TopKeywordsChart frequencies={topKeywordFrequencies} selectedWord={selectedWord} onSelectWord={handleSelectWord} />
          </div>
        </section>

        <div className="flex justify-center">
          <img src="/images/divider-2.png" alt="" className="w-full max-w-2xl" style={{ filter: "sepia(1) hue-rotate(175deg) saturate(0.6) brightness(0.55) opacity(0.7)" }} />
        </div>

        <section id="theme-explorer">
          <SectionHeading title="Theme Explorer" description="Six thematic lenses through which the Korean Gallery frames its objects. Select a theme to filter the analysis above." />
          <div className="mt-8">
            <ThemeExplorer selectedTheme={selectedTheme} onSelectTheme={handleSelectTheme} onSelectKeyword={handleSelectWord} />
          </div>
        </section>

        <div className="flex justify-center">
          <img src="/images/divider-2.png" alt="" className="w-full max-w-2xl" style={{ filter: "sepia(1) hue-rotate(175deg) saturate(0.6) brightness(0.55) opacity(0.7)" }} />
        </div>

        <section id="interpretation">
          <SectionHeading title="What Does This Language Tell Us?" description="The patterns revealed by the text analysis help explain how the Korean Gallery constructs meaning through curatorial language." />
          <div className="mt-8">
            <CuratorialInterpretation />
          </div>
        </section>
      </div>

      <div className="mt-16 -mx-6 md:-mx-10">
        <FinalInsightPanel />
      </div>
    </>
  );
}
