"use client";

import { useRef } from "react";
import clsx from "clsx";

interface MapToolbarProps {
  editMode: boolean;
  onToggleEdit: () => void;
  onUploadImage: (file: File) => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
  onResetMap: () => void;
}

export default function MapToolbar({
  editMode,
  onToggleEdit,
  onUploadImage,
  onExportData,
  onImportData,
  onResetMap,
}: MapToolbarProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const dataInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <button
        onClick={onToggleEdit}
        className={clsx(
          "text-xs uppercase tracking-widest2 px-4 py-2 border transition-museum",
          editMode
            ? "bg-ink text-background border-ink"
            : "border-light-gray text-text-gray hover:border-ink hover:text-ink"
        )}
      >
        {editMode ? "Editing: On" : "Edit Hotspots"}
      </button>

      <button
        onClick={() => imageInputRef.current?.click()}
        className="text-xs uppercase tracking-widest2 px-4 py-2 border border-light-gray text-text-gray hover:border-ink hover:text-ink transition-museum"
      >
        Upload Map Image
      </button>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUploadImage(file);
          e.target.value = "";
        }}
      />

      <button
        onClick={onExportData}
        className="text-xs uppercase tracking-widest2 px-4 py-2 border border-light-gray text-text-gray hover:border-ink hover:text-ink transition-museum"
      >
        Export Hotspot Data
      </button>

      <button
        onClick={() => dataInputRef.current?.click()}
        className="text-xs uppercase tracking-widest2 px-4 py-2 border border-light-gray text-text-gray hover:border-ink hover:text-ink transition-museum"
      >
        Import Hotspot Data
      </button>
      <input
        ref={dataInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImportData(file);
          e.target.value = "";
        }}
      />

      <button
        onClick={onResetMap}
        className="text-xs uppercase tracking-widest2 px-4 py-2 border border-light-gray text-text-gray hover:border-ink hover:text-ink transition-museum ml-auto"
      >
        Reset Map
      </button>
    </div>
  );
}
