import { Hotspot } from "./types";

// localStorage keys for the Interactive Map system.
// All data is stored client-side so the project can run without a backend.
// Use "Export Data" on the map page to save hotspots.json for permanent storage
// alongside your gallery map image in /public/images/.
const MAP_IMAGE_KEY = "aok_map_image";
const HOTSPOTS_KEY = "aok_hotspots";

export function loadMapImage(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(MAP_IMAGE_KEY);
}

export function saveMapImage(dataUrl: string) {
  window.localStorage.setItem(MAP_IMAGE_KEY, dataUrl);
}

export function clearMapImage() {
  window.localStorage.removeItem(MAP_IMAGE_KEY);
}

export function loadHotspots(): Hotspot[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(HOTSPOTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Hotspot[];
  } catch {
    return [];
  }
}

export function saveHotspots(hotspots: Hotspot[]) {
  window.localStorage.setItem(HOTSPOTS_KEY, JSON.stringify(hotspots, null, 2));
}

export function createEmptyHotspot(x: number, y: number): Hotspot {
  return {
    id: `hotspot-${Date.now()}`,
    x,
    y,
    type: "object",
    label: "",
    objectName: "Untitled Object",
    objectNumber: "",
    period: "",
    description: "",
    curatorialInterpretation: "",
    keywords: [],
  };
}
