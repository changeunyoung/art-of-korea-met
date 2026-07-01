"use client";

import { Hotspot } from "@/lib/types";

interface HotspotEditorPanelProps {
  hotspot: Hotspot | null;
  onChange: (hotspot: Hotspot) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function HotspotEditorPanel({
  hotspot,
  onChange,
  onDelete,
  onClose,
}: HotspotEditorPanelProps) {
  if (!hotspot) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-8 py-16 text-text-gray">
        <p className="text-xs uppercase tracking-widest2 mb-3">Edit Mode</p>
        <p className="font-sans text-xl leading-relaxed">
          Click anywhere on the map to place a new hotspot, or select an
          existing hotspot to edit its details. Drag hotspots to reposition them.
        </p>
      </div>
    );
  }

  const field = (
    label: string,
    key: keyof Hotspot,
    type: "input" | "textarea" = "input"
  ) => {
    const value = hotspot[key];
    const stringValue = Array.isArray(value) ? value.join(", ") : ((value as string) ?? "");

    const handleChange = (val: string) => {
      if (key === "keywords") {
        onChange({
          ...hotspot,
          keywords: val
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
        });
      } else {
        onChange({ ...hotspot, [key]: val });
      }
    };

    return (
      <div>
        <label className="text-xs uppercase tracking-widest2 text-text-gray">{label}</label>
        {type === "textarea" ? (
          <textarea
            value={stringValue}
            onChange={(e) => handleChange(e.target.value)}
            rows={4}
            className="mt-1 w-full bg-background-soft border border-light-gray px-3 py-2 text-sm focus:outline-none focus:border-text-gray transition-museum resize-none"
          />
        ) : (
          <input
            value={stringValue}
            onChange={(e) => handleChange(e.target.value)}
            className="mt-1 w-full bg-background-soft border border-light-gray px-3 py-2 text-sm focus:outline-none focus:border-text-gray transition-museum"
          />
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col px-8 py-10 overflow-y-auto animate-fadeIn">
      <div className="flex items-start justify-between mb-6">
        <p className="text-xs uppercase tracking-widest2 text-text-gray">Edit Hotspot</p>
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="text-text-gray hover:text-ink transition-museum text-sm"
        >
          Close ×
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs uppercase tracking-widest2 text-text-gray">Type</label>
            <select
              value={hotspot.type}
              onChange={(e) =>
                onChange({ ...hotspot, type: e.target.value as Hotspot["type"] })
              }
              className="mt-1 w-full bg-background-soft border border-light-gray px-3 py-2 text-sm focus:outline-none focus:border-text-gray transition-museum"
            >
              <option value="object">Object (numbered)</option>
              <option value="wallText">Wall Text (lettered)</option>
            </select>
          </div>
          {field("Marker Label", "label")}
        </div>
        {field("Object Name", "objectName")}
        {field("Object Number", "objectNumber")}
        {field("Period", "period")}
        {field("Description", "description", "textarea")}
        {field("Credit Line", "credit")}
        {field("Curatorial Interpretation", "curatorialInterpretation", "textarea")}
        {field("Keywords (comma-separated)", "keywords")}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-xs uppercase tracking-widest2 text-text-gray">
              Position X (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={hotspot.x.toFixed(1)}
              onChange={(e) => onChange({ ...hotspot, x: Number(e.target.value) })}
              className="mt-1 w-full bg-background-soft border border-light-gray px-3 py-2 text-sm focus:outline-none focus:border-text-gray transition-museum"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest2 text-text-gray">
              Position Y (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={hotspot.y.toFixed(1)}
              onChange={(e) => onChange({ ...hotspot, y: Number(e.target.value) })}
              className="mt-1 w-full bg-background-soft border border-light-gray px-3 py-2 text-sm focus:outline-none focus:border-text-gray transition-museum"
            />
          </div>
        </div>

        <button
          onClick={() => onDelete(hotspot.id)}
          className="mt-4 w-full border border-light-gray py-2 text-xs uppercase tracking-widest2 text-text-gray hover:border-ink hover:text-ink transition-museum"
        >
          Delete Hotspot
        </button>
      </div>
    </div>
  );
}
