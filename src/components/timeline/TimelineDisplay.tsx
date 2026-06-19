"use client";

import { TimelineEntry } from "@/lib/types";
import { useRef, useEffect, useState, useCallback } from "react";

interface TimelineDisplayProps {
  entries: TimelineEntry[];
  onSelectEntry: (entry: TimelineEntry) => void;
}

export default function TimelineDisplay({ entries, onSelectEntry }: TimelineDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumbLeft, setThumbLeft] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(40);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const scrollable = el.scrollWidth - el.clientWidth;
    const trackW = track.clientWidth;
    const tW = Math.max(40, (el.clientWidth / el.scrollWidth) * trackW);
    const tLeft = scrollable > 0 ? (el.scrollLeft / scrollable) * (trackW - tW) : 0;
    setThumbWidth(tW);
    setThumbLeft(tLeft);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateThumb);
    window.addEventListener("resize", updateThumb);
    updateThumb();
    return () => {
      el.removeEventListener("scroll", updateThumb);
      window.removeEventListener("resize", updateThumb);
    };
  }, [updateThumb, entries]);

  const onThumbMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartScroll.current = scrollRef.current?.scrollLeft ?? 0;
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !scrollRef.current || !trackRef.current) return;
      const track = trackRef.current;
      const el = scrollRef.current;
      const scrollable = el.scrollWidth - el.clientWidth;
      const trackW = track.clientWidth;
      const tW = Math.max(40, (el.clientWidth / el.scrollWidth) * trackW);
      const ratio = scrollable / (trackW - tW);
      el.scrollLeft = dragStartScroll.current + (e.clientX - dragStartX.current) * ratio;
    };
    const onMouseUp = () => { isDragging.current = false; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

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
      <div className="hidden md:block relative">
        <div
          ref={scrollRef}
          className="relative overflow-x-auto pb-4 timeline-scroll-hide"
        >
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

        {/* Custom scrollbar */}
        <div
          ref={trackRef}
          className="relative h-12 mx-8 mt-2"
          style={{ userSelect: "none" }}
        >
          {/* track line */}
          <div className="absolute top-1/2 left-0 right-0 h-3 bg-light-gray -translate-y-1/2 rounded-full" />
          {/* thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing flex items-center justify-center"
            style={{ left: thumbLeft, width: thumbWidth }}
            onMouseDown={onThumbMouseDown}
          >
            <img
              src="/images/logo/foot.png"
              alt=""
              aria-hidden="true"
              style={{ height: 72, width: 72, transform: "rotate(90deg)" }}
            />
          </div>
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
