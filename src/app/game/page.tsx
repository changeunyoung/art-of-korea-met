export default function GamePage() {
  return (
    <div style={{ backgroundColor: "#2E4A6B", minHeight: "100vh", marginTop: "-80px", paddingTop: "80px" }}>
    <div className="mx-auto max-w-content px-6 md:px-10 py-16 md:py-20">
      <p className="text-xs uppercase tracking-widest2 text-text-gray [font-family:var(--font-display)] mb-3">
        Mini Game
      </p>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 [font-family:var(--font-display)]">
        Be the Curator
      </h1>
      <div className="w-8 h-px bg-ink mb-8" />
      <p className="font-mono text-text-gray text-base max-w-lg">
        Coming soon.
      </p>
    </div>
    </div>
  );
}
