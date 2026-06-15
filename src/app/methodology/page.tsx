import SectionHeading from "@/components/SectionHeading";

interface MethodSection {
  number: string;
  title: string;
  body: string[];
}

const sections: MethodSection[] = [
  {
    number: "01",
    title: "Research Question",
    body: [
      "This project asks how object placement, gallery layout, and curatorial text in the Korean Gallery at The Metropolitan Museum of Art shape visitors' understanding of Korean art. It treats the gallery itself as a primary source — a constructed environment whose spatial and textual choices carry interpretive weight alongside the objects it displays.",
    ],
  },
  {
    number: "02",
    title: "Field Observation",
    body: [
      "Direct, on-site observation forms the empirical foundation of this project. Observation sessions document the physical arrangement of the gallery: which objects are positioned near entrances or sightlines, which are placed in secondary alcoves, and how lighting, casework, and signage direct visitor attention.",
      // TODO: Replace with your own field observation methodology — dates, duration, number of visits, observation protocol, etc.
      "[Placeholder: Describe your field observation protocol — number of site visits, duration, what was recorded (notes, sketches, photographs), and any ethical permissions required for on-site research.]",
    ],
  },
  {
    number: "03",
    title: "Spatial Mapping",
    body: [
      "The Interactive Map translates field observation into a spatial dataset. Each object is recorded as a hotspot on a floor plan, annotated with its object number, period, description, and a curatorial interpretation explaining why the research team believes the object occupies its position within the room.",
      // TODO: Replace with details about how your floor plan was obtained/created and how positions were measured.
      "[Placeholder: Describe how the floor plan image was obtained (e.g. museum publication, original sketch, architectural plan) and how object positions were measured or estimated.]",
    ],
  },
  {
    number: "04",
    title: "Timeline Research",
    body: [
      "The Timeline situates objects and curatorial narratives within a broader historical framework, drawing on dynastic chronology and exhibition history. By visualizing how different categories — material, religion, dynasty, craftsmanship, identity, nation, East Asia, and modernity — are distributed across time, the timeline reveals which periods and themes receive curatorial emphasis.",
      // TODO: Replace with details about your data sources for the timeline.
      "[Placeholder: Describe the sources used to compile the timeline spreadsheet — e.g. museum object records, exhibition catalogues, secondary scholarship — and how entries were selected and categorized.]",
    ],
  },
  {
    number: "05",
    title: "Curatorial Text Analysis",
    body: [
      "The Text Analysis page applies computational text analysis to curatorial label language. By tokenizing label text, removing common stop words, and computing keyword frequencies, the project surfaces the vocabulary through which Korean art is described to the public — and groups that vocabulary into thematic categories to reveal patterns of emphasis.",
      // TODO: Replace with details about how label texts were collected and any limitations of the analysis.
      "[Placeholder: Describe how curatorial label texts were collected (e.g. transcribed on-site, sourced from museum publications) and note any limitations of frequency-based text analysis, such as the absence of contextual or rhetorical nuance.]",
    ],
  },
  {
    number: "06",
    title: "Ethical Considerations",
    body: [
      "This project engages critically with an institution's interpretive choices without claiming to represent the museum's own perspective. All analysis is presented as the research team's interpretation, clearly distinguished from official museum text.",
      // TODO: Replace with your own ethics statement — IRB/ethics approval, photography policy compliance, attribution practices, etc.
      "[Placeholder: Describe ethical considerations specific to your research — e.g. compliance with museum photography policies, attribution of museum-published text, handling of any visitor data collected during field observation, and acknowledgement of the limits of an outside researcher's interpretation of curatorial intent.]",
    ],
  },
];

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-content px-6 md:px-10 py-16 md:py-20">
      <SectionHeading
        eyebrow="Project Methodology"
        title="Methodology"
        description="This page documents the research design behind Art of Korea: Making Curatorial Structures Visible. Each method contributes a distinct perspective on how the Korean Gallery shapes interpretation — together, they form a multi-method approach to reading museum space as text."
      />

      <div className="mt-16 space-y-16">
        {sections.map((section) => (
          <section key={section.number} className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 md:gap-12">
            <div>
              <span className="font-serif text-4xl text-text-gray">{section.number}</span>
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl mb-4">{section.title}</h2>
              <div className="section-rule mb-5" />
              <div className="space-y-4 text-text-gray leading-relaxed max-w-2xl">
                {section.body.map((paragraph, i) => (
                  <p key={i} className={paragraph.startsWith("[Placeholder") ? "italic text-text-gray/80" : ""}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
