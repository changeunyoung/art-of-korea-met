"use client";

import { useEffect } from "react";
import { TimelineEntry } from "@/lib/types";

interface TimelineEntryModalProps {
  entry: TimelineEntry | null;
  onClose: () => void;
}

export default function TimelineEntryModal({ entry, onClose }: TimelineEntryModalProps) {
  useEffect(() => {
    if (!entry) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [entry, onClose]);

  if (!entry) return null;

  const isExhibition = entry.category === "Exhibition";
  const isVideo = /youtube\.com|youtu\.be|vimeo\.com/i.test(entry.media);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white border border-light-gray px-8 md:px-12 py-10 md:py-14 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-6 right-6 text-text-gray hover:text-ink transition-museum text-sm uppercase tracking-widest2"
        >
          Close ×
        </button>

        {isExhibition && (
          <p className="text-xs uppercase tracking-widest2 text-accent mb-3">Exhibition</p>
        )}
        <p className="font-serif text-4xl md:text-5xl">{entry.year}</p>
        <div className="section-rule my-5" />
        <h3 className="font-serif text-2xl md:text-3xl leading-snug mb-4">{entry.title}</h3>
        <p className="text-text-gray leading-relaxed">{entry.description}</p>

        {entry.media && (
          <div className="mt-6">
            {isVideo ? (
              <a
                href={entry.media}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm uppercase tracking-widest2 text-accent hover:underline"
              >
                Watch video ↗
              </a>
            ) : (
              <img
                src={entry.media}
                alt={entry.mediaCaption || entry.title}
                className="w-full max-h-80 object-contain bg-background border border-light-gray"
              />
            )}
            {(entry.mediaCaption || entry.mediaCredit) && (
              <p className="mt-2 text-xs text-text-gray leading-relaxed">
                {entry.mediaCaption}
                {entry.mediaCaption && entry.mediaCredit && " — "}
                {entry.mediaCredit && <span className="italic">{entry.mediaCredit}</span>}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
