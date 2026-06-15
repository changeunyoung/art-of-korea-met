import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import MethodCard from "@/components/MethodCard";

export default function HomePage() {
  return (
    <div>
      {/* ─────────────────────────────────────────────────────────
          HERO SECTION
          PLACEHOLDER: public/images/hero-moon-jar.svg
          Replace with a high-resolution photograph of the Korean
          Moon Jar (e.g. public/images/hero-moon-jar.jpg) and update
          the src below.
         ───────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[100vh] -mt-20 flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero-moon-jar.svg"
          alt="Korean Moon Jar, Joseon Dynasty white porcelain — placeholder image"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/40" />

        <div className="relative z-10 text-center px-6 animate-fadeInSlow">
          <p className="text-xs md:text-sm uppercase tracking-widest2 text-text-gray mb-6">
            A Digital Humanities Capstone Project
          </p>
          <h1 className="font-serif text-5xl md:text-7xl tracking-wide text-ink">
            Art of Korea
          </h1>
          <p className="mt-4 text-base md:text-lg uppercase tracking-widest2 text-text-gray">
            at the Metropolitan Museum of Art
          </p>
          <p className="mt-8 font-serif italic text-xl md:text-2xl text-ink">
            Making Curatorial Structures Visible
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-text-gray text-xs uppercase tracking-widest2 animate-fadeIn">
          Scroll
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          INTRODUCTION
         ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-content px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest2 text-text-gray mb-4">Introduction</p>
          <p className="font-serif text-2xl md:text-3xl leading-relaxed text-ink">
            Museum galleries are not neutral spaces. Visitors do not simply encounter
            objects — they encounter them through a sequence of curatorial decisions:
            where an object is placed, how a room is organized, which path a body is
            guided to walk, and which words are chosen to explain what is seen.
          </p>
          <p className="mt-6 text-text-gray leading-relaxed">
            {/* TODO: Replace with your own project introduction (2–4 paragraphs). */}
            This project examines the Korean Gallery at The Metropolitan Museum of
            Art as a constructed interpretive environment. By mapping the placement
            of objects, tracing visitor movement through the gallery, charting the
            historical timeline presented to the public, and analyzing the language
            of curatorial labels, this site makes visible the structures that quietly
            shape how Korean art is understood by museum visitors.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          RESEARCH QUESTION
         ───────────────────────────────────────────────────────── */}
      <section className="bg-background-soft">
        <div className="mx-auto max-w-content px-6 md:px-10 py-20 md:py-28">
          <SectionHeading
            eyebrow="Research Question"
            title="How do curatorial structures shape understanding?"
          />
          <p className="mt-8 max-w-3xl font-serif text-xl md:text-2xl leading-relaxed text-ink">
            How do object placement, gallery layout, and curatorial text in the
            Korean Gallery at the Metropolitan Museum of Art shape visitors'
            understanding of Korean art?
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          METHODS
         ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-content px-6 md:px-10 py-20 md:py-28">
        <SectionHeading
          eyebrow="Methods"
          title="Three approaches to an invisible structure"
          description="Each method below offers a different lens on the same gallery — together, they reveal how spatial design, historical framing, and language work in concert to shape interpretation."
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <MethodCard
            index="01 — Spatial Mapping"
            title="Interactive Map"
            description="Explore an annotated floor plan of the Korean Gallery. Each hotspot reveals an object's placement, period, and the curatorial reasoning behind its position in the room."
            href="/map"
          />
          <MethodCard
            index="02 — Historical Framing"
            title="Timeline"
            description="A chronological view of the dynasties, objects, and narratives presented to visitors — drawn directly from gallery and exhibition records."
            href="/timeline"
          />
          <MethodCard
            index="03 — Curatorial Language"
            title="Text Analysis"
            description="A close reading of curatorial label text, surfacing recurring vocabulary and the thematic categories through which Korean art is framed."
            href="/text-analysis"
          />
        </div>
      </section>
    </div>
  );
}
