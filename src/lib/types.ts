// Shared type definitions for the Art of Korea project

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  /** Badge width as % of container (from image detection) */
  w?: number;
  /** Badge height as % of container (from image detection) */
  h?: number;
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
  /** Donor/acquisition credit line, e.g. "Gift of ..., 1994 (1995.69)" */
  credit?: string;
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
  number?: number;
  name: string;
  period: string;
  material: string;
  credit: string;
  description: string;
  koreanName?: string;
  url?: string;
}

export interface WallText {
  id: string;
  label: string;
  title: string;
  text: string;
}
