"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const RESEARCH_STEPS = [
  {
    title: "Literature Review",
    content: [
      "The project was informed by scholarship in museum studies, art history, and digital humanities. Particular attention was given to research on curatorial interpretation, exhibition design, museum narratives, and Franco Moretti's concept of distant reading. These theoretical frameworks helped shape both the research question and analytical approach.",
    ],
  },
  {
    title: "Field Observation",
    content: [
      "This project began with direct observation of Art of Korea at The Metropolitan Museum of Art. From January to May 2026, multiple site visits were conducted to document object placement, gallery layout, interpretive labels, exhibition organization, and visitor circulation patterns. Photographs, sketches, floor plans, and field notes were collected to create a detailed record of the gallery environment.",
      "The gallery itself was treated as a primary source, providing the foundation for all subsequent analysis and digital visualization.",
    ],
  },
  {
    title: "Digital Humanities Approach",
    content: [
      "This project combines multiple digital humanities methods to examine Art of Korea from different perspectives. Rather than relying on a single visualization, the website integrates spatial analysis, historical research, text analysis, and interactive experimentation to investigate how curatorial meaning is produced and communicated.",
      "Together, these approaches reveal patterns that are often difficult to recognize during a physical museum visit.",
    ],
  },
];

function ResearchCarousel() {
  const n = RESEARCH_STEPS.length;
  // Extended: [clone of last, ...real slides, clone of first]
  const extended = [RESEARCH_STEPS[n - 1], ...RESEARCH_STEPS, RESEARCH_STEPS[0]];
  const [current, setCurrent] = useState(0); // real index 0..n-1
  const scrollRef = useRef<HTMLDivElement>(null);
  const jumping = useRef(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>();

  // Init at extIdx=1 (first real slide)
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.offsetWidth;
  }, []);

  const scrollToExt = (extIdx: number, behavior: ScrollBehavior = "smooth") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: extIdx * el.offsetWidth, behavior });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (jumping.current) return;
      const extIdx = Math.round(el.scrollLeft / el.offsetWidth);
      // Update dot indicator (real index)
      const realIdx = extIdx === 0 ? n - 1 : extIdx === n + 1 ? 0 : extIdx - 1;
      setCurrent(realIdx);

      clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => {
        const settled = Math.round(el.scrollLeft / el.offsetWidth);
        if (settled === 0) {
          // clone of last → jump silently to real last
          jumping.current = true;
          el.scrollLeft = n * el.offsetWidth;
          requestAnimationFrame(() => { jumping.current = false; });
        } else if (settled === n + 1) {
          // clone of first → jump silently to real first
          jumping.current = true;
          el.scrollLeft = 1 * el.offsetWidth;
          requestAnimationFrame(() => { jumping.current = false; });
        }
      }, 120);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer.current);
    };
  }, [n]);

  const goNext = () => {
    const el = scrollRef.current;
    if (!el) return;
    const extIdx = Math.round(el.scrollLeft / el.offsetWidth);
    scrollToExt(extIdx + 1);
  };
  const goPrev = () => {
    const el = scrollRef.current;
    if (!el) return;
    const extIdx = Math.round(el.scrollLeft / el.offsetWidth);
    scrollToExt(extIdx - 1);
  };
  const goToReal = (realIdx: number) => scrollToExt(realIdx + 1);

  return (
    <section id="research-process" className="mb-12">
      <h2 className="text-xs uppercase tracking-widest2 text-text-gray mb-8 font-bold text-center">Research Process</h2>
      <div className="flex items-center gap-4">
        <button onClick={goPrev} className="flex-shrink-0 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-text-gray hover:text-ink transition-colors" aria-label="Previous">←</button>
        <div
          ref={scrollRef}
          className="flex-1 flex overflow-x-auto"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        >
          {extended.map((s, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-full relative bg-white rounded-2xl shadow-sm px-10 pt-8 pb-12 min-h-[360px]"
              style={{ scrollSnapAlign: "start" }}
            >
              <h3 className="text-sm font-semibold text-ink mb-4 text-center">{s.title}</h3>
              {s.content.map((para, j) => (
                <p key={j} className={`text-sm text-text-gray leading-relaxed font-sans text-justify${j > 0 ? " mt-4" : ""}`}>{para}</p>
              ))}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {RESEARCH_STEPS.map((_, di) => (
                  <button key={di} onClick={() => goToReal(di)} className={`w-1.5 h-1.5 rounded-full transition-colors ${di === current ? "bg-ink" : "bg-light-gray"}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={goNext} className="flex-shrink-0 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-text-gray hover:text-ink transition-colors" aria-label="Next">→</button>
      </div>
      <div className="flex justify-center mt-0">
        <div
          style={{
            width: 55,
            height: 215,
            backgroundImage: "url('/images/Norigae.png')",
            backgroundSize: "270px 270px",
            backgroundPosition: "-131px -21px",
            backgroundRepeat: "no-repeat",
            opacity: 0.6,
          }}
          aria-label="Korean traditional norigae"
        />
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", marginTop: "-80px", paddingTop: "80px" }}>
      <div className="mx-auto max-w-content px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-3xl mx-auto" style={{ backgroundColor: "#F4F7FA", borderRadius: "24px", padding: "48px 48px" }}>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-2 text-center">
            Art of Korea at the Met
          </h1>
          <p className="font-display text-lg text-text-gray mb-8 uppercase tracking-widest2 text-center">
            Making Curatorial Structures Visible
          </p>

          <div className="flex justify-center mb-10" style={{ marginTop: -16 }}>
            <img src="/images/Frame_1.png" alt="" aria-hidden="true" style={{ width: "100%", maxWidth: 560, opacity: 0.7 }} />
          </div>

          <section id="about" className="mb-4">
            <p className="text-sm text-text-gray leading-relaxed font-sans text-justify">
              <strong className="text-ink">Art of Korea at the Met: Making Curatorial Structures Visible</strong> is a digital humanities project that examines <strong className="text-ink">Art of Korea, The Metropolitan Museum of Art&apos;s permanent galleries dedicated to Korean art,</strong> as an interpretive environment rather than a neutral container of artifacts.
            </p>
            <p className="text-sm text-text-gray leading-relaxed font-sans mt-4">
              The project explores how museums construct meaning through curatorial decisions, including object placement, exhibition design, and interpretive language. By making these often-invisible structures visible, the project encourages visitors to think critically about how museum narratives are created and communicated.
            </p>
          </section>

          {/* Flying bird strip */}
          <div style={{ position: "relative", height: 180, overflow: "hidden", margin: "0.5rem 0" }}>
            <style>{`
              @keyframes flyAcross {
                from { transform: translateX(-200px) rotate(4deg); }
                to   { transform: translateX(calc(768px + 200px)) rotate(4deg); }
              }
            `}</style>
            <video
              src="/videos/flyingbird.mp4"
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: "absolute",
                top: 10,
                left: 0,
                width: 160,
                opacity: 0.85,
                animation: "flyAcross 18s linear infinite",
              }}
            />
          </div>

          <div className="w-8 h-px bg-light-gray mb-6" />

          <section id="research-question" className="mb-12 relative">
            {/* Cloud decorations */}
            <img src="/images/clould_3.png" alt="" aria-hidden="true" style={{ position: "absolute", top: 100, left: 10, width: 90, opacity: 0.5, pointerEvents: "none" }} />
            <img src="/images/clould_4.png" alt="" aria-hidden="true" style={{ position: "absolute", top: 110, left: 80, width: 30, opacity: 0.45, pointerEvents: "none" }} />
            <img src="/images/cloud_1.png"  alt="" aria-hidden="true" style={{ position: "absolute", bottom: 80, right: -20, width: 130, opacity: 0.5, pointerEvents: "none" }} />
            <img src="/images/clould_4.png" alt="" aria-hidden="true" style={{ position: "absolute", top: -18, right: 120, width: 26, opacity: 0.5, pointerEvents: "none" }} />
            <img src="/images/clould_4.png" alt="" aria-hidden="true" style={{ position: "absolute", top: 30, right: 10, width: 18, opacity: 0.35, pointerEvents: "none" }} />
            <h2 className="text-xs uppercase tracking-widest2 text-text-gray mb-4 font-bold text-center">Research Question</h2>
            <p className="font-display text-xl text-ink leading-relaxed text-center" style={{ color: "#5b86bb" }}>
              How do object placement, gallery layout, and curatorial text in<br />Art of Korea at The Metropolitan Museum of Art<br />construct narratives about Korean art?
            </p>
          </section>

          <div className="w-8 h-px bg-light-gray mb-12" />

          <ResearchCarousel />

          <div className="w-8 h-px bg-light-gray mb-12" />

          <section id="limitations" className="mb-12">
            <h2 className="text-xs uppercase tracking-widest2 text-text-gray mb-4 font-bold text-center">Limitations</h2>
            <p className="text-sm text-text-gray leading-relaxed font-sans text-justify">
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
            <h2 className="text-xs uppercase tracking-widest2 text-text-gray mb-4 font-bold text-center">Ethical Considerations</h2>
            <p className="text-sm text-text-gray leading-relaxed font-sans text-justify">
              This project engages critically with the interpretive structures of Art of Korea without claiming to represent the official views of The Metropolitan Museum of Art. All analysis reflects the researcher&apos;s interpretation based on field observation, publicly available museum information, and digital humanities methods. Label texts, wall texts, object descriptions, and other museum materials reproduced on this website remain the intellectual property of The Metropolitan Museum of Art and are included for educational and research purposes only.
            </p>
          </section>

          <div className="w-8 h-px bg-light-gray mb-12" />

          <section id="credits">
            <h2 className="text-xs uppercase tracking-widest2 text-text-gray mb-4 font-bold text-center">Credits</h2>
            <p className="text-sm text-ink font-sans">Clara Eunyoung Chang</p>
            <p className="text-sm text-text-gray font-sans mt-1">HS313 Digital Humanities Capstone Project</p>
            <p className="text-sm text-text-gray font-sans">Taejae University · Spring 2026</p>

            <h3 className="text-xs uppercase tracking-widest2 text-text-gray mt-8 mb-3 text-center font-display font-bold">References & Sources</h3>
            <p className="text-sm text-text-gray font-sans">The Metropolitan Museum of Art Collection Database</p>
            <p className="text-sm text-text-gray font-sans mt-1">The Metropolitan Museum of Art Korean Gallery</p>
          </section>

        </div>
      </div>
    </div>
  );
}
