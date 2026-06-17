"use client";

import { TimelineEntry } from "@/lib/types";

interface TimelineDisplayProps {
  entries: TimelineEntry[];
  onSelectEntry: (entry: TimelineEntry) => void;
}

export default function TimelineDisplay({ entries, onSelectEntry }: TimelineDisplayProps) {
  if (entries.length === 0) {
    return (
      <div className="py-20 text-center text-text-gray">
        <p className="font-display text-xl">No timeline entries match this filter.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: horizontal scrollable timeline */}
      <div className="hidden md:block relative overflow-x-auto pb-16">
        <div className="relative min-w-max flex items-start gap-0 pt-10 px-8">
          <div className="absolute top-[45px] left-0 right-0 h-px bg-light-gray" />
          {entries.map((entry, i) => (
            <button
              key={`${entry.year}-${i}`}
              type="button"
              onClick={() => onSelectEntry(entry)}
              className="group flex flex-col items-center w-64 px-4 shrink-0 text-left cursor-pointer transition-museum"
            >
              <div className="relative w-full flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-ink z-10 transition-museum group-hover:scale-150 group-hover:bg-accent group-hover:ring-4 group-hover:ring-accent/40" />
              </div>
              <div className="mt-6 text-center transition-museum group-hover:-translate-y-1">
                <p className="font-display text-4xl tracking-widest text-[#7BAEC8]">{entry.year}</p>
                <p className="mt-1 font-display text-xl tracking-wide leading-tight group-hover:underline">
                  {entry.title}
                </p>
                <p className="mt-2 font-sans text-xs text-text-gray leading-relaxed line-clamp-3">
                  {entry.description}
                </p>
                <span className="mt-3 inline-block text-[10px] uppercase tracking-widest2 text-text-gray opacity-0 group-hover:opacity-100 transition-museum">
                  Read more
                </span>
              </div>
            </button>
          ))}
          <div className="shrink-0 w-8" />
        </div>
      </div>

      {/* Mobile: vertical timeline */}
      <div className="md:hidden relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-light-gray" />
        <div className="space-y-10">
          {entries.map((entry, i) => (
            <button
              key={`${entry.year}-${i}`}
              type="button"
              onClick={() => onSelectEntry(entry)}
              className="group relative pl-8 text-left w-full cursor-pointer"
            >
              <span className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-ink transition-museum group-active:scale-125" />
              <p className="font-display text-4xl tracking-widest text-[#7BAEC8]">{entry.year}</p>
              <p className="mt-1 font-display text-xl tracking-wide leading-tight group-hover:underline">
                {entry.title}
              </p>
              <p className="mt-2 font-sans text-xs text-text-gray leading-relaxed line-clamp-3">
                {entry.description}
              </p>
              <span className="mt-2 inline-block text-[10px] uppercase tracking-widest2 text-text-gray">
                Tap to read more
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
