"use client";

import { useRef } from "react";

interface TimelineUploadProps {
  onFile: (file: File) => void;
  onReset: () => void;
  error: string | null;
}

export default function TimelineUpload({ onFile, onReset, error }: TimelineUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-3 mb-8">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => inputRef.current?.click()}
          className="text-xs uppercase tracking-widest2 px-4 py-2 border border-light-gray text-text-gray hover:border-ink hover:text-ink transition-museum"
        >
          Upload Timeline Data (.csv / .xlsx)
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
            e.target.value = "";
          }}
        />
        <button
          onClick={onReset}
          className="text-xs uppercase tracking-widest2 px-4 py-2 border border-light-gray text-text-gray hover:border-ink hover:text-ink transition-museum"
        >
          Reset to Sample Data
        </button>
      </div>
      {error && <p className="text-sm text-text-gray">{error}</p>}
    </div>
  );
}
