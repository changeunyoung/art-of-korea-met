export default function Footer() {
  return (
    <footer className="border-t border-light-gray bg-background mt-24">
      <div className="mx-auto max-w-content px-6 md:px-10 py-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="font-display text-xl tracking-wide">Art of Korea</p>
          <p className="text-sm text-text-gray mt-1">
            Making Curatorial Structures Visible — a digital humanities capstone project.
          </p>
        </div>
        <div className="text-xs text-text-gray uppercase tracking-widest2 leading-relaxed">
          <p>HS313 · Digital Humanities Capstone</p>
          <p>The Metropolitan Museum of Art, Korean Gallery</p>
          {/* TODO: Replace with your name / institution / academic year */}
          <p className="mt-2">Researcher Name · Institution · Year</p>
        </div>
      </div>
    </footer>
  );
}
