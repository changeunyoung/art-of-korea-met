export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "#F4F7FA", minHeight: "100vh", marginTop: "-80px", paddingTop: "80px" }}>
      <div className="mx-auto max-w-content px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-2xl">

          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-2">
            Art of Korea at the Met
          </h1>
          <p className="font-display text-lg text-text-gray mb-12 uppercase tracking-widest2">
            Making Curatorial Structures Visible
          </p>

          <section id="about" className="mb-12">
            <p className="text-sm text-text-gray leading-relaxed font-sans">
              <strong className="text-ink">Art of Korea at the Met: Making Curatorial Structures Visible</strong> is a digital humanities project that examines <strong className="text-ink">Art of Korea, The Metropolitan Museum of Art&apos;s permanent galleries dedicated to Korean art,</strong> as an interpretive environment rather than a neutral container of artifacts.
            </p>
            <p className="text-sm text-text-gray leading-relaxed font-sans mt-4">
              The project explores how museums construct meaning through curatorial decisions, including object placement, exhibition design, and interpretive language. By making these often-invisible structures visible, the project encourages visitors to think critically about how museum narratives are created and communicated.
            </p>
          </section>

          <div className="w-8 h-px bg-light-gray mb-12" />

          <section id="research-question" className="mb-12">
            <h2 className="text-xs uppercase tracking-widest2 text-text-gray mb-4 font-bold">Research Question</h2>
            <p className="font-borel text-xl text-ink leading-relaxed" style={{ color: "#4A90B8" }}>
              How do object placement, gallery layout, and curatorial text in Art of Korea at The Metropolitan Museum of Art construct narratives about Korean art?
            </p>
          </section>

          <div className="w-8 h-px bg-light-gray mb-12" />

          <section id="research-process" className="mb-12">
            <h2 className="text-xs uppercase tracking-widest2 text-text-gray mb-4 font-bold">Research Process</h2>
            <h3 className="text-sm font-semibold text-ink mb-3">Field Observation</h3>
            <p className="text-sm text-text-gray leading-relaxed font-sans">
              This project began with direct observation of Art of Korea at The Metropolitan Museum of Art. <strong className="text-ink">From January to May 2026, multiple site visits were conducted</strong> to document object placement, gallery layout, interpretive labels, exhibition organization, and visitor circulation patterns. Photographs, sketches, floor plans, and field notes were collected to create a detailed record of the gallery environment.
            </p>
            <p className="text-sm text-text-gray leading-relaxed font-sans mt-4">
              The gallery itself was treated as a primary source, providing the foundation for all subsequent analysis and digital visualization.
            </p>
          </section>

          <div className="w-8 h-px bg-light-gray mb-12" />

          <section id="dh-approach" className="mb-12">
            <h2 className="text-xs uppercase tracking-widest2 text-text-gray mb-4 font-bold">Digital Humanities Approach</h2>
            <p className="text-sm text-text-gray leading-relaxed font-sans">
              This project combines multiple digital humanities methods to examine Art of Korea from different perspectives.
            </p>
            <p className="text-sm text-text-gray leading-relaxed font-sans mt-4">
              Rather than relying on a single visualization, the website integrates spatial analysis, historical research, text analysis, and interactive experimentation to investigate how curatorial meaning is produced and communicated.
            </p>
            <p className="text-sm text-text-gray leading-relaxed font-sans mt-4">
              Together, these approaches reveal patterns that are often difficult to recognize during a physical museum visit.
            </p>
          </section>

          <div className="w-8 h-px bg-light-gray mb-12" />

          <section id="limitations" className="mb-12">
            <h2 className="text-xs uppercase tracking-widest2 text-text-gray mb-4 font-bold">Limitations</h2>
            <p className="text-sm text-text-gray leading-relaxed font-sans">
              This project focuses on curatorial structures rather than visitor behavior.
            </p>
            <p className="text-sm text-text-gray leading-relaxed font-sans mt-4">
              While the website can reveal intended pathways of interpretation, it cannot fully capture how individual visitors experience, understand, or respond to the gallery. Likewise, digital visualizations cannot completely represent atmosphere, scale, lighting conditions, movement, or emotional responses within the museum environment.
            </p>
            <p className="text-sm text-text-gray leading-relaxed font-sans mt-4">
              The project therefore analyzes the gallery&apos;s interpretive framework rather than measuring visitor reception directly.
            </p>
          </section>

          <div className="w-8 h-px bg-light-gray mb-12" />

          <section id="ethics" className="mb-12">
            <h2 className="text-xs uppercase tracking-widest2 text-text-gray mb-4 font-bold">Ethical Considerations</h2>
            <p className="text-sm text-text-gray leading-relaxed font-sans">
              This project engages critically with the interpretive structures of Art of Korea without claiming to represent the official views of The Metropolitan Museum of Art. All analysis reflects the researcher&apos;s interpretation based on field observation, publicly available museum information, and digital humanities methods. Label texts, wall texts, object descriptions, and other museum materials reproduced on this website remain the intellectual property of The Metropolitan Museum of Art and are included for educational and research purposes only.
            </p>
          </section>

          <div className="w-8 h-px bg-light-gray mb-12" />

          <section id="credits">
            <h2 className="text-xs uppercase tracking-widest2 text-text-gray mb-4 font-bold">Credits</h2>
            <p className="text-sm text-ink font-sans">Clara Eunyoung Chang</p>
            <p className="text-sm text-text-gray font-sans mt-1">HS313 Digital Humanities Capstone Project</p>
            <p className="text-sm text-text-gray font-sans">Taejae University · Spring 2026</p>

            <h3 className="text-xs uppercase tracking-widest2 text-text-gray mt-8 mb-3">References & Sources</h3>
            <p className="text-sm text-text-gray font-sans">The Metropolitan Museum of Art Collection Database</p>
            <p className="text-sm text-text-gray font-sans mt-1">The Metropolitan Museum of Art Korean Gallery</p>
          </section>

        </div>
      </div>
    </div>
  );
}
