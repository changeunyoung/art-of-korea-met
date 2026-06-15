"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import MapCanvas from "@/components/map/MapCanvas";
import MapToolbar from "@/components/map/MapToolbar";
import HotspotInfoPanel from "@/components/map/HotspotInfoPanel";
import HotspotEditorPanel from "@/components/map/HotspotEditorPanel";
import { Hotspot } from "@/lib/types";
import {
  createEmptyHotspot,
  loadHotspots,
  loadMapImage,
  saveHotspots,
  saveMapImage,
  clearMapImage,
} from "@/lib/mapStorage";

const PLACEHOLDER_MAP = "/images/gallery-233-floor-plan.svg";
const DEFAULT_HOTSPOTS_URL = "/data/gallery-233-hotspots.json";

export default function InteractiveMapPage() {
  const [mapImage, setMapImage] = useState<string>(PLACEHOLDER_MAP);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state from localStorage on mount. If no hotspots have
  // been saved yet, load the Gallery 233 sample annotations as a starting point.
  useEffect(() => {
    const storedImage = loadMapImage();
    if (storedImage) setMapImage(storedImage);

    const storedHotspots = loadHotspots();
    if (storedHotspots.length > 0) {
      setHotspots(storedHotspots);
      setHydrated(true);
    } else {
      fetch(DEFAULT_HOTSPOTS_URL)
        .then((res) => res.json())
        .then((data: Hotspot[]) => setHotspots(data))
        .catch(() => setHotspots([]))
        .finally(() => setHydrated(true));
    }
  }, []);

  // Persist hotspots whenever they change
  useEffect(() => {
    if (!hydrated) return;
    saveHotspots(hotspots);
  }, [hotspots, hydrated]);

  const selectedHotspot = hotspots.find((h) => h.id === selectedId) ?? null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleAddHotspot = (x: number, y: number) => {
    const newHotspot = createEmptyHotspot(x, y);
    setHotspots((prev) => [...prev, newHotspot]);
    setSelectedId(newHotspot.id);
  };

  const handleMoveHotspot = (id: string, x: number, y: number) => {
    setHotspots((prev) => prev.map((h) => (h.id === id ? { ...h, x, y } : h)));
  };

  const handleChangeHotspot = (updated: Hotspot) => {
    setHotspots((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  };

  const handleDeleteHotspot = (id: string) => {
    setHotspots((prev) => prev.filter((h) => h.id !== id));
    setSelectedId(null);
  };

  const handleUploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setMapImage(dataUrl);
      saveMapImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleResetMap = () => {
    clearMapImage();
    setMapImage(PLACEHOLDER_MAP);
  };

  const handleExportData = () => {
    const blob = new Blob([JSON.stringify(hotspots, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hotspots.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as Hotspot[];
        if (Array.isArray(data)) {
          setHotspots(data);
          setSelectedId(null);
        }
      } catch {
        // eslint-disable-next-line no-alert
        alert("Could not read this file. Please upload a valid hotspots.json export.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto max-w-content px-6 md:px-10 py-16 md:py-20">
      <SectionHeading
        eyebrow="Method 01 — Spatial Mapping"
        title="Interactive Map"
        description="Annotated floor plan of the Korean Gallery. Each hotspot marks an object's position and records the curatorial reasoning behind its placement. Toggle Edit Mode to upload your own gallery map and place, move, or edit hotspots."
      />

      <div className="mt-12">
        {/* ─────────────────────────────────────────────────────────
            PLACEHOLDER DATA NOTICE
            Replace the placeholder gallery map via "Upload Map Image"
            and populate hotspots via "Edit Hotspots". Use "Export
            Hotspot Data" to save your work as hotspots.json, which
            can be placed in /public/data/ for permanent storage.
           ───────────────────────────────────────────────────────── */}
        <MapToolbar
          editMode={editMode}
          onToggleEdit={() => setEditMode((v) => !v)}
          onUploadImage={handleUploadImage}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onResetMap={handleResetMap}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-0 border border-light-gray bg-white">
          <div className="p-4 md:p-6">
            <MapCanvas
              mapImage={mapImage}
              hotspots={hotspots}
              editMode={editMode}
              selectedId={selectedId}
              onSelect={handleSelect}
              onAddHotspot={handleAddHotspot}
              onMoveHotspot={handleMoveHotspot}
            />
          </div>

          <div className="border-t lg:border-t-0 lg:border-l border-light-gray bg-background-soft min-h-[320px] lg:min-h-[520px]">
            {editMode ? (
              <HotspotEditorPanel
                hotspot={selectedHotspot}
                onChange={handleChangeHotspot}
                onDelete={handleDeleteHotspot}
                onClose={() => setSelectedId(null)}
              />
            ) : (
              <HotspotInfoPanel hotspot={selectedHotspot} onClose={() => setSelectedId(null)} />
            )}
          </div>
        </div>

        <p className="mt-4 text-xs text-text-gray leading-relaxed">
          Hotspot data is stored in your browser. Use "Export Hotspot Data" regularly
          to back up your annotations as a JSON file.
        </p>
      </div>
    </div>
  );
}
