"use client";

import { useEffect, useState } from "react";
import MapIsometric from "./MapIsometric";
import HotspotInfoPanel from "./HotspotInfoPanel";
import { Hotspot } from "@/lib/types";

const DEFAULT_HOTSPOTS_URL = "/data/gallery-233-hotspots.json";

export default function MapInteractive() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch(DEFAULT_HOTSPOTS_URL)
      .then((res) => res.json())
      .then((data: Hotspot[]) => setHotspots(data))
      .catch(() => setHotspots([]));
  }, []);

  const selectedHotspot = hotspots.find((h) => h.id === selectedId) ?? null;

  return (
    <div className="border border-light-gray bg-white">
      <div className="p-4 md:p-6">
        <MapIsometric
          hotspots={hotspots}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
      <div className="border-t border-light-gray bg-background-soft min-h-[320px]">
        <HotspotInfoPanel hotspot={selectedHotspot} onClose={() => setSelectedId(null)} />
      </div>
    </div>
  );
}
