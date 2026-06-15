"use client";

import { Hotspot } from "@/lib/types";

interface HotspotInfoPanelProps {
  hotspot: Hotspot | null;
  onClose: () => void;
}

export default function HotspotInfoPanel({ hotspot, onClose }: HotspotInfoPanelProps) {
  if (!hotspot) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-8 py-16 text-text-gray">
        <p className="text-xs uppercase tracking-widest2 mb-3">Digital Gallery Guide</p>
        <p className="font-serif text-xl leading-relaxed">
          Select a hotspot on the map to view information about the object,
          its placement, and curatorial interpretation.
        </p>
      </div>
    );
  }

  const isWallText = hotspot.type === "wallText";

  return (
    <div className="h-full flex flex-col px-8 py-10 overflow-y-auto animate-fadeIn">
      <div className="flex items-start justify-between mb-6">
        <p className="text-xs uppercase tracking-widest2 text-text-gray">
          {isWallText ? "Wall Text Panel" : "Object Record"}
        </p>
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="text-text-gray hover:text-ink transition-museum text-sm"
        >
          Close ×
        </button>
      </div>

      {hotspot.label && (
        <p className="text-xs uppercase tracking-widest2 text-text-gray mb-2">
          {isWallText ? `Wall Text ${hotspot.label}` : `Object ${hotspot.label}`}
        </p>
      )}
      <h3 className="font-serif text-3xl leading-snug">{hotspot.objectName || "Untitled Object"}</h3>

      <dl className="mt-6 space-y-4 text-sm">
        {!isWallText && (
          <div>
            <dt className="text-xs uppercase tracking-widest2 text-text-gray">Object Number</dt>
            <dd className="mt-1 text-ink">{hotspot.objectNumber || "—"}</dd>
          </div>
        )}
        {!isWallText && (
          <div>
            <dt className="text-xs uppercase tracking-widest2 text-text-gray">Period</dt>
            <dd className="mt-1 text-ink">{hotspot.period || "—"}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs uppercase tracking-widest2 text-text-gray">
            {isWallText ? "Label Text" : "Description"}
          </dt>
          <dd className="mt-1 text-ink leading-relaxed">{hotspot.description || "—"}</dd>
        </div>
        <div className="border-t border-light-gray pt-4">
          <dt className="text-xs uppercase tracking-widest2 text-text-gray">
            Curatorial Interpretation
          </dt>
          <dd className="mt-1 text-ink leading-relaxed font-serif text-lg italic">
            {hotspot.curatorialInterpretation || "—"}
          </dd>
          <p className="mt-2 text-[11px] text-text-gray leading-relaxed">
            This section reflects the research team&rsquo;s analysis of why this object
            occupies this position within the gallery, and how its placement shapes
            visitor interpretation.
          </p>
        </div>
        {hotspot.keywords.length > 0 && (
          <div className="border-t border-light-gray pt-4">
            <dt className="text-xs uppercase tracking-widest2 text-text-gray mb-2">Keywords</dt>
            <dd className="flex flex-wrap gap-2">
              {hotspot.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs px-3 py-1 rounded-full bg-background-soft text-ink"
                >
                  {kw}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
