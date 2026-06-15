"use client";

import { useEffect, useMemo, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import TimelineDisplay from "@/components/timeline/TimelineDisplay";
import TimelineUpload from "@/components/timeline/TimelineUpload";
import TimelineEntryModal from "@/components/timeline/TimelineEntryModal";
import { TimelineEntry } from "@/lib/types";
import { loadDefaultTimeline, parseTimelineFile } from "@/lib/timelineData";

export default function TimelinePage() {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<TimelineEntry | null>(null);

  // ─────────────────────────────────────────────────────────────
  // PLACEHOLDER DATA
  // On load, this page reads /public/data/timeline-sample.csv.
  // Replace that file with your own spreadsheet (same columns:
  // Year, Title, Description, Category), or use the "Upload
  // Timeline Data" button to load a .csv / .xlsx file at runtime.
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    loadDefaultTimeline()
      .then(setEntries)
      .catch(() => setError("Could not load the sample timeline data."))
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

  const handleFile = async (file: File) => {
    try {
      const parsed = await parseTimelineFile(file);
      setEntries(parsed);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not parse this file.");
    }
  };

  const handleReset = () => {
    setLoading(true);
    loadDefaultTimeline()
      .then((data) => {
        setEntries(data);
        setError(null);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="mx-auto max-w-content px-6 md:px-10 py-16 md:py-20">
      <SectionHeading
        eyebrow="Method 02 — Historical Framing"
        title="Timeline"
        description="A chronological view of the dynasties, objects, and narratives presented in the Korean Gallery. Click any point on the timeline to read more about that moment."
      />

      <div className="mt-12">
        <TimelineUpload onFile={handleFile} onReset={handleReset} error={error} />

        <div className="mt-10 bg-white border border-light-gray px-2 md:px-6 py-10">
          {loading ? (
            <p className="text-center text-text-gray py-20">Loading timeline…</p>
          ) : (
            <TimelineDisplay entries={sortedEntries} onSelectEntry={setSelectedEntry} />
          )}
        </div>

        <p className="mt-4 text-xs text-text-gray leading-relaxed">
          Expected spreadsheet columns: <span className="font-medium">Year, Title, Description, Category</span>.
          Suggested categories include Material, Religion, Dynasty, Craftsmanship, Identity, Nation,
          East Asia, and Modernity.
        </p>
      </div>

      <TimelineEntryModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </div>
  );
}
