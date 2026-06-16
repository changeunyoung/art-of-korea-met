"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import MapCanvas from "@/components/map/MapCanvas";
import HotspotInfoPanel from "@/components/map/HotspotInfoPanel";
import { Hotspot } from "@/lib/types";

const DEFAULT_HOTSPOTS_URL = "/data/gallery-233-hotspots.json";

export default function InteractiveMapPage() {
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
    <div className="mx-auto max-w-content px-6 md:px-10 py-16 md:py-20">
      <SectionHeading
        eyebrow="Method 01 — Spatial Mapping"
        title="Interactive Map"
        description="Annotated floor plan of the Korean Gallery. Each hotspot marks an object&rsquo;s position and records the curatorial reasoning behind its placement."
      />

      <div className="mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-0 border border-light-gray bg-white">
          <div className="p-4 md:p-6">
            <MapCanvas
              mapImage="/images/gallery-233-floor-plan.svg"
              hotspots={hotspots}
              editMode={false}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onAddHotspot={() => {}}
              onMoveHotspot={() => {}}
            />
          </div>

          <div className="border-t lg:border-t-0 lg:border-l border-light-gray bg-background-soft min-h-[320px] lg:min-h-[520px]">
            <HotspotInfoPanel hotspot={selectedHotspot} onClose={() => setSelectedId(null)} />
          </div>
        </div>
      </div>
    </div>
  );
}
