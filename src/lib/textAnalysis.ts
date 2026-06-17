import Papa from "papaparse";
import { WordFrequency } from "./types";

// A standard English stopword list used to filter out function words
// before computing keyword frequencies.
export const STOPWORDS = new Set([
  "a","about","above","after","again","against","all","am","an","and","any","are","aren't",
  "as","at","be","because","been","before","being","below","between","both","but","by",
  "can","cannot","could","couldn't","did","didn't","do","does","doesn't","doing","don't",
  "down","during","each","few","for","from","further","had","hadn't","has","hasn't","have",
  "haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him",
  "himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't",
  "it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor",
  "not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out",
  "over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so",
  "some","such","than","that","that's","the","their","theirs","them","themselves","then",
  "there","there's","these","they","they'd","they'll","they're","they've","this","those",
  "through","to","too","under","until","up","very","was","wasn't","we","we'd","we'll",
  "we're","we've","were","weren't","what","what's","when","when's","where","where's",
  "which","while","who","who's","whom","why","why's","with","without","won't","would",
  "wouldn't","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves",
  "also","may","one","two","upon","within","among","whose","thus","however","often",
]);

// Thematic category dictionaries — used to classify frequent terms into
// curatorial themes relevant to this project. Tuned to the vocabulary of
// the Arts of Korea Gallery label-text word-frequency analysis.
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Dynastic History": ["dynasty","dynastic","joseon","goryeo","silla","baekje","1392","918","kingdom","kingdoms","royal","court","king","queen","reign","reigned","era","period","prehistory","ancient","historical","12th","13th","14th","15th","16th","17th","18th","19th","20th","21st","century"],
  "Materials & Techniques": ["bronze","celadon","glaze","glazed","porcelain","stoneware","silver","gold","jade","lacquer","wood","paper","silk","cotton","ink","iron","metal","clay","stone","glass","niello","inlaid","sanggam","openwork","gilt","mold","molded","incised","impressed","technique","techniques","firing","kiln","production","construction","stamped","cobalt","craft","decoration","decorated","motif","motifs","pattern","patterns","design"],
  "Religion & Ritual": ["buddhist","buddhism","temple","shrine","ritual","sacred","monk","worship","deity","ceremony","spiritual","offering","offerings","consecration","bodhisattva","buddha","kashyapa","sanskrit","cosmology","auspicious","bokjang","symbol","symbols","symbolism","symbolizing","tomb"],
  "Everyday Life & Function": ["bowl","bowls","jar","dish","cup","box","vessel","container","mirror","mirrors","handle","lid","screen","textiles","tobacco","utility","use","used","using","function","household","tile","fittings","needle","chime","seal"],
  "Collecting History": ["gift","gifts","fund","rogers","purchase","collection","museum","gallery","exhibition","display","displayed","donor","donated","bequest","acquired","acquisition","foundation","samuel","peters","mary","nina","michael","rockefeller","friends","lee","kun","1910","1915","1917","1922","scan","scans"],
  "Cultural Identity": ["korea","korean","korea’s","asia","asian","national","nation","nations","culture","cultural","intercultural","heritage","identity","society","societies","traditions","tradition","history","peninsula","peninsula’s"],
};

const TOKEN_REGEX = /[a-zA-Z']+/g;

export function tokenize(text: string): string[] {
  const matches = text.toLowerCase().match(TOKEN_REGEX);
  return matches ? matches.map((w) => w.replace(/^'+|'+$/g, "")).filter(Boolean) : [];
}

export interface FrequencyOptions {
  removeStopwords: boolean;
  minFrequency: number;
}

export function computeFrequencies(
  text: string,
  { removeStopwords, minFrequency }: FrequencyOptions
): WordFrequency[] {
  const tokens = tokenize(text);
  const counts = new Map<string, number>();

  for (const token of tokens) {
    if (token.length < 2) continue;
    if (removeStopwords && STOPWORDS.has(token)) continue;
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .filter(([, count]) => count >= minFrequency)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value);
}

export interface ThematicMatch {
  category: string;
  matches: WordFrequency[];
  total: number;
}

export function categorizeFrequencies(frequencies: WordFrequency[]): ThematicMatch[] {
  return Object.entries(CATEGORY_KEYWORDS).map(([category, keywords]) => {
    const matches = frequencies.filter((f) =>
      keywords.some((kw) => f.text.includes(kw) || kw.includes(f.text))
    );
    const total = matches.reduce((sum, m) => sum + m.value, 0);
    return { category, matches, total };
  });
}

export function frequenciesToCSV(frequencies: WordFrequency[]): string {
  const header = "term,frequency";
  const rows = frequencies.map((f) => `${f.text},${f.value}`);
  return [header, ...rows].join("\n");
}

// Loads a pre-computed term/frequency dataset (e.g. exported from a word
// frequency analysis of curatorial label text) and sorts it by frequency.
// Returns the thematic category that best matches a given word, or null
// if the word does not fall under any of the curatorial themes.
export function getThemeForWord(word: string): string | null {
  const lower = word.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw) || kw.includes(lower))) {
      return category;
    }
  }
  return null;
}

// Splits the full label text into sentences and returns up to `maxResults`
// sentences that contain the given word (case-insensitive, whole-word match).
export function findExcerpts(fullText: string, word: string, maxResults?: number): string[] {
  // Split on newlines first to preserve credit lines, then split each chunk by sentence boundaries
  const lines = fullText.split(/\n/);
  const segments: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Further split long lines into sentences
    const sentences = trimmed.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
    segments.push(...sentences);
  }

  const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");

  const matched = segments.filter((s) => pattern.test(s));
  return maxResults !== undefined ? matched.slice(0, maxResults) : matched;
}

// Finds objects whose name or description contains the given word
// (case-insensitive, whole-word match).
export function findRelatedObjects<T extends { name: string; description: string; period?: string; material?: string; credit?: string }>(
  objects: T[],
  word: string
): T[] {
  const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  return objects.filter(
    (obj) =>
      pattern.test(obj.name) ||
      pattern.test(obj.description) ||
      pattern.test(obj.period ?? "") ||
      pattern.test(obj.material ?? "") ||
      pattern.test(obj.credit ?? "")
  );
}

// Loads the full curatorial label text used for the Context Viewer.
export async function loadLabelFullText(): Promise<string> {
  const res = await fetch("/data/label-fulltext.txt");
  return res.text();
}

// Loads the curated object records used for the Related Objects section.
export async function loadLabelObjects<T = unknown>(): Promise<T[]> {
  const res = await fetch("/data/label-objects.json");
  return res.json();
}

export async function loadWallTexts<T = unknown>(): Promise<T[]> {
  const res = await fetch("/data/wall-texts.json");
  return res.json();
}

export function findRelatedWallTexts<T extends { title: string; text: string }>(
  wallTexts: T[],
  word: string
): T[] {
  const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  return wallTexts.filter((wt) => pattern.test(wt.title) || pattern.test(wt.text));
}

export async function loadDefaultFrequencies(): Promise<WordFrequency[]> {
  const res = await fetch("/data/word-frequencies.csv");
  const text = await res.text();
  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const frequencies = results.data
          .map((row) => ({
            text: String(row["term"] ?? "").trim(),
            value: Number(row["frequency"] ?? 0),
          }))
          .filter((f) => f.text !== "" && !isNaN(f.value))
          .sort((a, b) => b.value - a.value);
        resolve(frequencies);
      },
    });
  });
}
