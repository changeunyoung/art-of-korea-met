"use client";

import { useEffect, useMemo, useState } from "react";
import TimelineDisplay from "./TimelineDisplay";
import TimelineEntryModal from "./TimelineEntryModal";
import { TimelineEntry } from "@/lib/types";
import { loadDefaultTimeline } from "@/lib/timelineData";

export default function TimelineInteractive() {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<TimelineEntry | null>(null);

  useEffect(() => {
    loadDefaultTimeline()
      .then(setEntries)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      const yearA = parseInt(a.year, 10);
      const yearB = parseInt(b.year, 10);
      if (isNaN(yearA) || isNaN(yearB)) return a.year.localeCompare(b.year);
      return yearA - yearB;
    });
  }, [entries]);

  return (
    <>
      <div className="bg-white border border-light-gray px-2 md:px-6 py-10">
        {loading ? (
          <p className="text-center text-text-gray py-20">Loading timeline…</p>
        ) : (
          <TimelineDisplay entries={sortedEntries} onSelectEntry={setSelectedEntry} />
        )}
      </div>
      <TimelineEntryModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </>
  );
}
