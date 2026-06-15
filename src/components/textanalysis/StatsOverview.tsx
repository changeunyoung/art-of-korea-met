"use client";

import { useEffect, useState } from "react";

interface StatsOverviewProps {
  totalLabels: number;
  totalWords: number;
  uniqueWords: number;
}

function CountUpValue({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value <= 0) {
      setDisplay(0);
      return;
    }
    const duration = 1000;
    const start = performance.now();

    let frame: number;
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span>{display.toLocaleString()}</span>;
}

export default function StatsOverview({ totalLabels, totalWords, uniqueWords }: StatsOverviewProps) {
  const stats: { label: string; hoverLabel?: string; value: number }[] = [
    {
      label: "Total Labels",
      hoverLabel: "47 Object Captions · 5 Wall Texts",
      value: totalLabels,
    },
    { label: "Total Words", value: totalWords },
    { label: "Unique Words", value: uniqueWords },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-light-gray border border-light-gray">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group relative bg-white px-6 py-10 text-center transition-museum hover:bg-background-soft"
        >
          <p className="font-serif text-4xl md:text-5xl text-ink">
            <CountUpValue value={stat.value} />
          </p>
          <p className="relative mt-3 text-xs uppercase tracking-widest2 text-text-gray">
            {stat.hoverLabel ? (
              <>
                <span className="transition-museum group-hover:opacity-0">{stat.label}</span>
                <span className="absolute inset-x-0 left-0 whitespace-nowrap opacity-0 transition-museum group-hover:opacity-100 normal-case">
                  {stat.hoverLabel}
                </span>
              </>
            ) : (
              stat.label
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
