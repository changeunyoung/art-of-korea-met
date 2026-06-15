# Art of Korea — at the Metropolitan Museum of Art
### Making Curatorial Structures Visible

A digital humanities capstone project (Next.js / TypeScript / Tailwind CSS)
examining how object placement, gallery layout, and curatorial text in the
Korean Gallery at The Metropolitan Museum of Art shape visitors' understanding
of Korean art.

---

## Getting Started

This project requires **Node.js 18+** and npm.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
  app/
    page.tsx              → Home
    map/page.tsx          → Interactive Map
    timeline/page.tsx      → Timeline
    text-analysis/page.tsx → Text Analysis
    methodology/page.tsx   → Methodology
    layout.tsx, globals.css
  components/
    Navbar.tsx, Footer.tsx, SectionHeading.tsx, MethodCard.tsx
    map/        → MapCanvas, HotspotMarker, info & editor panels, toolbar
    timeline/   → TimelineDisplay, CategoryFilter, upload control
    textanalysis/ → input panel, controls, word cloud, charts, lists
  lib/
    types.ts          → shared TypeScript types
    mapStorage.ts      → localStorage helpers for the Interactive Map
    timelineData.ts    → CSV/Excel parsing for the Timeline
    textAnalysis.ts    → tokenizing, frequency, stopwords, thematic categories
public/
  images/  → hero image, gallery map (placeholders)
  data/    → sample timeline CSV, sample label text, sample hotspots JSON
```

---

## Replacing Placeholder Content

Every placeholder is marked with a `// TODO` or `PLACEHOLDER` comment in the
source. The main items to replace before presenting this project:

### 1. Home page hero image
- File: `public/images/hero-moon-jar.svg`
- Replace with a high-resolution photograph of the Korean Moon Jar (or your
  chosen reference image). Update the `src` in `src/app/page.tsx` if you
  rename the file (e.g. to `hero-moon-jar.jpg`).

### 2. Home page introduction text
- File: `src/app/page.tsx`
- Replace the introduction paragraph(s) marked `TODO: Replace with your own
  project introduction`.

### 3. Interactive Map
- Go to **Interactive Map → Edit Hotspots** in the running site.
- Click **"Upload Map Image"** to load your own gallery floor plan (stored in
  the browser via localStorage).
- Click anywhere on the map to place a hotspot, drag to reposition, and fill
  in the side panel: Object Name, Object Number, Period, Description,
  Curatorial Interpretation, and Keywords.
- Use **"Export Hotspot Data"** to download `hotspots.json` for safekeeping,
  and **"Import Hotspot Data"** to reload it later (e.g. on another browser).
- A reference file is provided at `public/data/hotspots-sample.json`.

### 4. Timeline
- File: `public/data/timeline-sample.csv`
- Replace with your own spreadsheet (CSV or Excel `.xlsx`) using the columns:
  `Year, Title, Description, Category`.
- Alternatively, use the **"Upload Timeline Data"** button on the Timeline
  page to load a file at runtime without replacing the sample file.
- Suggested categories: Material, Religion, Dynasty, Craftsmanship, Identity,
  Nation, East Asia, Modernity.

### 5. Text Analysis
- File: `public/data/sample-label-text.txt`
- Replace with your transcribed curatorial label texts, or use the
  **"Paste Text"**, **"Upload .txt"**, or **"Upload CSV"** controls on the
  Text Analysis page.
- Adjust the thematic category keyword dictionary in
  `src/lib/textAnalysis.ts` (`CATEGORY_KEYWORDS`) to match the vocabulary of
  your own corpus.

### 6. Methodology page
- File: `src/app/methodology/page.tsx`
- Replace the paragraphs beginning with `[Placeholder: ...]` with your own
  methodology details (field observation protocol, data sources, ethics
  approvals, etc.).

### 7. Footer / attribution
- File: `src/components/Footer.tsx`
- Replace researcher name, institution, and academic year.

---

## Notes

- **No fabricated museum data is included.** All object, period, and
  curatorial text fields are placeholders intended to be replaced with your
  own research.
- The Interactive Map system stores hotspot data and the uploaded map image
  in the browser's `localStorage`. Export your hotspot data regularly.
- The design system (colors, typography, spacing) is defined in
  `tailwind.config.ts` and `src/app/globals.css` — adjust there to maintain
  consistency across the site.
