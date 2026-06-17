// Shared type definitions for the Art of Korea project

export interface Hotspot {
  id: string;
  /** Position as a percentage (0–100) of the map image width */
  x: number;
  /** Position as a percentage (0–100) of the map image height */
  y: number;
  /** "object" = numbered display case/artwork, "wallText" = lettered wall label panel */
  type: "object" | "wallText";
  /** Short marker label shown on the map (e.g. object number "12" or wall text letter "A") */
  label: string;
  objectName: string;
  objectNumber: string;
  period: string;
  description: string;
  curatorialInterpretation: string;
  keywords: string[];
  /** Korean title (Hangul + Hanja) */
  koreanName?: string;
  /** URL to the Met Museum collection page (or YouTube for video objects) */
  metUrl?: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  /** "Exhibition" for special exhibitions, or "" for other historical events */
  category: string;
  /** Pre-formatted date range, e.g. "Mar. 17, 2009 – Jun. 21, 2009" */
  displayDate?: string;
  /** URL to an associated image or video for this entry (optional) */
  media: string;
  /** Credit line for the media (optional) */
  mediaCredit: string;
  /** Caption describing the media (optional) */
  mediaCaption: string;
}

export interface WordFrequency {
  text: string;
  value: number;
}

export interface LabelObject {
  id: string;
  name: string;
  period: string;
  material: string;
  credit: string;
  description: string;
}
