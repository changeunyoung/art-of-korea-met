const INTERPRETATIONS = [
  {
    theme: "Dynastic History",
    text: "The gallery emphasizes historical dynasties and periods over individual artists.",
  },
  {
    theme: "Materials & Techniques",
    text: "Labels focus on how works were made rather than who made them.",
  },
  {
    theme: "Religion & Ritual",
    text: "Religious meaning and ritual function serve as a key interpretive frame.",
  },
  {
    theme: "Everyday Life & Function",
    text: "Objects are explained through everyday culture and social function.",
  },
  {
    theme: "Collecting History",
    text: "The current Korean collection was shaped through donation and acquisition.",
  },
  {
    theme: "Cultural Identity",
    text: "The continuity of Korean culture and tradition is repeatedly emphasized.",
  },
];

export default function CuratorialInterpretation() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-light-gray border border-light-gray">
      {INTERPRETATIONS.map((item) => (
        <div key={item.theme} className="bg-white p-6 transition-museum hover:bg-background-soft">
          <p className="text-xs uppercase tracking-widest2 text-text-gray mb-3">{item.theme}</p>
          <p className="text-ink leading-relaxed">{item.text}</p>
        </div>
      ))}
    </div>
  );
}
