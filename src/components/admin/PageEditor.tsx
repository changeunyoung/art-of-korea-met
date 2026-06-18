"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import HeroSection from "@/components/hero/HeroSection";
import AdminBar from "./AdminBar";
import AddBlockButton from "./AddBlockButton";
import BlockControls from "./BlockControls";
import MethodCard from "@/components/MethodCard";
import SectionHeading from "@/components/SectionHeading";
import {
  Block,
  HeroBlock,
  IntroBlock,
  ResearchQuestionBlock,
  MethodsBlock,
  PageHeadingBlock,
  MethodSectionBlock,
  HeadingBlock,
  BodyBlock,
  ImageBlock,
  ImageGridBlock,
  CardBlock,
  CTABlock,
  SpacerBlock,
} from "@/lib/contentTypes";

// ─── Editable text helper ──────────────────────────────────────────────────

function EditableText({
  value,
  onChange,
  className,
  tag: Tag = "span",
  multiline = false,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  multiline?: boolean;
}) {
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      className={`${className ?? ""} outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 rounded cursor-text`}
      onBlur={(e) => onChange((e.target as HTMLElement).textContent ?? "")}
      dangerouslySetInnerHTML={{ __html: value }}
      onKeyDown={multiline ? undefined : (e) => { if (e.key === "Enter") e.preventDefault(); }}
    />
  );
}

// ─── Image replace overlay ─────────────────────────────────────────────────

function ImageReplaceOverlay({ onUpload }: { onUpload: (url: string) => void }) {
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      onUpload(url);
    }
  }

  return (
    <label className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
      <span className="bg-white text-ink text-xs uppercase tracking-widest2 px-4 py-2 border border-white">
        이미지 교체
      </span>
      <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
    </label>
  );
}

// ─── Block renderers (editable) ────────────────────────────────────────────

function EditHero({ block, update }: { block: HeroBlock; update: (b: HeroBlock) => void }) {
  return <HeroSection />;
}

function EditIntro({ block, update }: { block: IntroBlock; update: (b: IntroBlock) => void }) {
  return (
    <section className="mx-auto max-w-content px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-3xl">
        <EditableText tag="p" value={block.label} onChange={(v) => update({ ...block, label: v })} className="text-xs uppercase tracking-widest2 text-text-gray mb-4 block" />
        <EditableText tag="p" value={block.leadParagraph} onChange={(v) => update({ ...block, leadParagraph: v })} multiline className="font-sans text-2xl md:text-3xl leading-relaxed text-ink block" />
        {block.bodyParagraphs.map((p, i) => (
          <EditableText
            key={i}
            tag="p"
            value={p}
            onChange={(v) => {
              const next = [...block.bodyParagraphs];
              next[i] = v;
              update({ ...block, bodyParagraphs: next });
            }}
            multiline
            className="mt-6 text-text-gray leading-relaxed block"
          />
        ))}
      </div>
    </section>
  );
}

function EditResearchQuestion({ block, update }: { block: ResearchQuestionBlock; update: (b: ResearchQuestionBlock) => void }) {
  return (
    <section className="bg-background-soft">
      <div className="mx-auto max-w-content px-6 md:px-10 py-20 md:py-28">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} />
        <div className="mt-2 -ml-1">
          <EditableText tag="p" value={block.eyebrow} onChange={(v) => update({ ...block, eyebrow: v })} className="sr-only" />
        </div>
        {/* Inline edit of heading via contentEditable overlays */}
        <div className="relative">
          <p className="mt-8 max-w-3xl font-sans text-xl md:text-2xl leading-relaxed text-ink hidden">{block.body}</p>
          <EditableText tag="p" value={block.body} onChange={(v) => update({ ...block, body: v })} multiline className="mt-8 max-w-3xl font-sans text-xl md:text-2xl leading-relaxed text-ink block" />
        </div>
      </div>
    </section>
  );
}

function EditMethods({ block, update }: { block: MethodsBlock; update: (b: MethodsBlock) => void }) {
  return (
    <section className="mx-auto max-w-content px-6 md:px-10 py-20 md:py-28">
      <SectionHeading eyebrow={block.eyebrow} title={block.title} description={block.description} />
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        {block.cards.map((card, i) => (
          <div key={i} className="relative group/card border border-light-gray bg-white p-6 md:p-8 flex flex-col gap-4 hover:bg-background-soft transition-museum">
            <EditableText tag="p" value={card.index} onChange={(v) => { const next = [...block.cards]; next[i] = { ...next[i], index: v }; update({ ...block, cards: next }); }} className="text-xs uppercase tracking-widest2 text-text-gray block" />
            <EditableText tag="h3" value={card.title} onChange={(v) => { const next = [...block.cards]; next[i] = { ...next[i], title: v }; update({ ...block, cards: next }); }} className="font-display text-xl md:text-2xl text-ink block" />
            <EditableText tag="p" value={card.description} onChange={(v) => { const next = [...block.cards]; next[i] = { ...next[i], description: v }; update({ ...block, cards: next }); }} multiline className="text-text-gray text-sm leading-relaxed block" />
          </div>
        ))}
      </div>
    </section>
  );
}

function EditPageHeading({ block, update }: { block: PageHeadingBlock; update: (b: PageHeadingBlock) => void }) {
  return (
    <div>
      <EditableText tag="p" value={block.eyebrow} onChange={(v) => update({ ...block, eyebrow: v })} className="text-xs uppercase tracking-widest2 text-text-gray mb-1 block" />
      <EditableText tag="h1" value={block.title} onChange={(v) => update({ ...block, title: v })} className="font-display text-4xl md:text-5xl text-ink mb-4 block" />
      <EditableText tag="p" value={block.description} onChange={(v) => update({ ...block, description: v })} multiline className="text-text-gray leading-relaxed block" />
    </div>
  );
}

function EditMethodSection({ block, update }: { block: MethodSectionBlock; update: (b: MethodSectionBlock) => void }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 md:gap-12">
      <div>
        <EditableText tag="span" value={block.number} onChange={(v) => update({ ...block, number: v })} className="font-display text-4xl text-text-gray" />
      </div>
      <div>
        <EditableText tag="h2" value={block.title} onChange={(v) => update({ ...block, title: v })} className="font-display text-2xl md:text-3xl mb-4 block" />
        <div className="section-rule mb-5" />
        <div className="space-y-4 text-text-gray leading-relaxed max-w-2xl">
          {block.paragraphs.map((p, i) => (
            <EditableText
              key={i}
              tag="p"
              value={p}
              onChange={(v) => { const next = [...block.paragraphs]; next[i] = v; update({ ...block, paragraphs: next }); }}
              multiline
              className={`block ${p.startsWith("[Placeholder") ? "italic text-text-gray/80" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function EditHeading({ block, update }: { block: HeadingBlock; update: (b: HeadingBlock) => void }) {
  const Tag = block.level;
  const sizeClass = block.level === "h2" ? "font-display text-2xl md:text-3xl" : "font-display text-xl md:text-2xl";
  return (
    <div className="mx-auto max-w-content px-6 md:px-10 py-4">
      <div className="flex gap-2 mb-2 text-xs">
        {(["h2", "h3"] as const).map((l) => (
          <button key={l} onClick={() => update({ ...block, level: l })} className={`px-2 py-0.5 border ${block.level === l ? "border-ink text-ink" : "border-light-gray text-text-gray"}`}>{l.toUpperCase()}</button>
        ))}
        {(["left", "center", "right"] as const).map((a) => (
          <button key={a} onClick={() => update({ ...block, align: a })} className={`px-2 py-0.5 border ${block.align === a ? "border-ink text-ink" : "border-light-gray text-text-gray"}`}>{a === "left" ? "←" : a === "center" ? "↔" : "→"}</button>
        ))}
      </div>
      <EditableText tag={Tag} value={block.text} onChange={(v) => update({ ...block, text: v })} className={`${sizeClass} text-${block.align} block`} />
    </div>
  );
}

function EditBody({ block, update }: { block: BodyBlock; update: (b: BodyBlock) => void }) {
  return (
    <div className="mx-auto max-w-content px-6 md:px-10 py-2">
      <div className="flex gap-2 mb-2 text-xs">
        {(["left", "center", "right"] as const).map((a) => (
          <button key={a} onClick={() => update({ ...block, align: a })} className={`px-2 py-0.5 border ${block.align === a ? "border-ink text-ink" : "border-light-gray text-text-gray"}`}>{a === "left" ? "←" : a === "center" ? "↔" : "→"}</button>
        ))}
      </div>
      <EditableText tag="p" value={block.text} onChange={(v) => update({ ...block, text: v })} multiline className={`text-text-gray leading-relaxed text-${block.align} block`} />
    </div>
  );
}

function EditImage({ block, update }: { block: ImageBlock; update: (b: ImageBlock) => void }) {
  return (
    <div className="mx-auto max-w-content px-6 md:px-10 py-4">
      <div className="relative">
        {block.src ? (
          <div className="relative">
            <img src={block.src} alt={block.alt} className="w-full object-cover max-h-[500px]" />
            <ImageReplaceOverlay onUpload={(url) => update({ ...block, src: url })} />
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-light-gray h-48 cursor-pointer hover:border-ink transition-museum">
            <span className="text-text-gray text-sm">클릭하여 이미지 업로드</span>
            <input type="file" accept="image/*" className="sr-only" onChange={async (e) => {
              const file = e.target.files?.[0]; if (!file) return;
              const fd = new FormData(); fd.append("file", file);
              const res = await fetch("/api/upload", { method: "POST", body: fd });
              if (res.ok) { const { url } = await res.json(); update({ ...block, src: url }); }
            }} />
          </label>
        )}
      </div>
      <input value={block.alt} onChange={(e) => update({ ...block, alt: e.target.value })} placeholder="이미지 설명 (alt text)" className="mt-2 w-full border border-light-gray px-2 py-1 text-xs text-text-gray focus:outline-none focus:border-ink" />
    </div>
  );
}

function EditImageGrid({ block, update }: { block: ImageGridBlock; update: (b: ImageGridBlock) => void }) {
  return (
    <div className="mx-auto max-w-content px-6 md:px-10 py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {block.images.map((img, i) => (
          <div key={i} className="relative">
            <img src={img.src} alt={img.alt} className="w-full object-cover h-40" />
            <ImageReplaceOverlay onUpload={(url) => { const next = [...block.images]; next[i] = { ...next[i], src: url }; update({ ...block, images: next }); }} />
          </div>
        ))}
        <label className="flex items-center justify-center border-2 border-dashed border-light-gray h-40 cursor-pointer hover:border-ink transition-museum">
          <span className="text-text-gray text-xs">+ 이미지 추가</span>
          <input type="file" accept="image/*" className="sr-only" onChange={async (e) => {
            const file = e.target.files?.[0]; if (!file) return;
            const fd = new FormData(); fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            if (res.ok) { const { url } = await res.json(); update({ ...block, images: [...block.images, { src: url, alt: "" }] }); }
          }} />
        </label>
      </div>
    </div>
  );
}

function EditCard({ block, update }: { block: CardBlock; update: (b: CardBlock) => void }) {
  return (
    <div className="mx-auto max-w-content px-6 md:px-10 py-4">
      <div className="border border-light-gray bg-white p-6">
        <EditableText tag="h3" value={block.title} onChange={(v) => update({ ...block, title: v })} className="font-display text-xl text-ink mb-2 block" />
        <EditableText tag="p" value={block.body} onChange={(v) => update({ ...block, body: v })} multiline className="text-text-gray leading-relaxed block" />
        <input value={block.href ?? ""} onChange={(e) => update({ ...block, href: e.target.value })} placeholder="링크 URL (선택)" className="mt-3 w-full border border-light-gray px-2 py-1 text-xs text-text-gray focus:outline-none focus:border-ink" />
      </div>
    </div>
  );
}

function EditCTA({ block, update }: { block: CTABlock; update: (b: CTABlock) => void }) {
  return (
    <div className="mx-auto max-w-content px-6 md:px-10 py-4">
      <div className="flex gap-2 mb-2 text-xs">
        {(["left", "center", "right"] as const).map((a) => (
          <button key={a} onClick={() => update({ ...block, align: a })} className={`px-2 py-0.5 border ${block.align === a ? "border-ink text-ink" : "border-light-gray text-text-gray"}`}>{a}</button>
        ))}
      </div>
      <div className={`flex ${block.align === "center" ? "justify-center" : block.align === "right" ? "justify-end" : "justify-start"}`}>
        <div className="inline-flex flex-col gap-1">
          <EditableText tag="span" value={block.text} onChange={(v) => update({ ...block, text: v })} className="border border-ink px-6 py-3 text-xs uppercase tracking-widest2 text-ink" />
          <input value={block.href} onChange={(e) => update({ ...block, href: e.target.value })} placeholder="링크 URL" className="border border-light-gray px-2 py-1 text-xs text-text-gray focus:outline-none focus:border-ink" />
        </div>
      </div>
    </div>
  );
}

function EditSpacer({ block, update }: { block: SpacerBlock; update: (b: SpacerBlock) => void }) {
  const heights: Record<SpacerBlock["size"], string> = { sm: "h-8", md: "h-16", lg: "h-32" };
  return (
    <div className={`${heights[block.size]} border border-dashed border-blue-200 flex items-center justify-center gap-3`}>
      <span className="text-xs text-blue-400 uppercase tracking-widest2">여백</span>
      {(["sm", "md", "lg"] as const).map((s) => (
        <button key={s} onClick={() => update({ ...block, size: s })} className={`text-xs px-2 py-0.5 border ${block.size === s ? "border-blue-400 text-blue-500" : "border-blue-200 text-blue-300"}`}>{s}</button>
      ))}
    </div>
  );
}

// ─── Read-only block renders (identical to original pages) ─────────────────

function ReadHero({ block }: { block: HeroBlock }) {
  return <HeroSection />;
}

function ReadIntro({ block }: { block: IntroBlock }) {
  return (
    <section className="mx-auto max-w-content px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-widest2 text-text-gray mb-4">{block.label}</p>
        <p className="font-sans text-2xl md:text-3xl leading-relaxed text-ink">{block.leadParagraph}</p>
        {block.bodyParagraphs.map((p, i) => (
          <p key={i} className="mt-6 text-text-gray leading-relaxed">{p}</p>
        ))}
      </div>
    </section>
  );
}

function ReadResearchQuestion({ block }: { block: ResearchQuestionBlock }) {
  return (
    <section className="bg-background-soft">
      <div className="mx-auto max-w-content px-6 md:px-10 py-20 md:py-28">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} />
        <p className="mt-8 max-w-3xl font-sans text-xl md:text-2xl leading-relaxed text-ink">{block.body}</p>
      </div>
    </section>
  );
}

function ReadMethods({ block }: { block: MethodsBlock }) {
  return (
    <section className="mx-auto max-w-content px-6 md:px-10 pt-32 pb-20 md:pt-40 md:pb-28">
      <SectionHeading eyebrow={block.eyebrow} title={block.title} description={block.description} />
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        {block.cards.map((card, i) => (
          <MethodCard key={i} index={card.index} title={card.title} description={card.description} href={card.href} />
        ))}
      </div>
    </section>
  );
}

function ReadPageHeading({ block }: { block: PageHeadingBlock }) {
  return <SectionHeading eyebrow={block.eyebrow} title={block.title} description={block.description} />;
}

function ReadMethodSection({ block }: { block: MethodSectionBlock }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 md:gap-12">
      <div><span className="font-display text-4xl text-text-gray">{block.number}</span></div>
      <div>
        <h2 className="font-display text-2xl md:text-3xl mb-4">{block.title}</h2>
        <div className="section-rule mb-5" />
        <div className="space-y-4 text-text-gray leading-relaxed max-w-2xl">
          {block.paragraphs.map((p, i) => (
            <p key={i} className={p.startsWith("[Placeholder") ? "italic text-text-gray/80" : ""}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReadHeading({ block }: { block: HeadingBlock }) {
  const Tag = block.level;
  const sizeClass = block.level === "h2" ? "font-display text-2xl md:text-3xl" : "font-display text-xl md:text-2xl";
  return (
    <div className="mx-auto max-w-content px-6 md:px-10 py-4">
      <Tag className={`${sizeClass} text-${block.align} text-ink`}>{block.text}</Tag>
    </div>
  );
}

function ReadBody({ block }: { block: BodyBlock }) {
  return (
    <div className="mx-auto max-w-content px-6 md:px-10 py-2">
      <p className={`text-text-gray leading-relaxed text-${block.align}`}>{block.text}</p>
    </div>
  );
}

function ReadImage({ block }: { block: ImageBlock }) {
  if (!block.src) return null;
  return (
    <div className="mx-auto max-w-content px-6 md:px-10 py-4">
      <img src={block.src} alt={block.alt} className="w-full object-cover" />
      {block.caption && <p className="mt-2 text-xs text-text-gray text-center">{block.caption}</p>}
    </div>
  );
}

function ReadImageGrid({ block }: { block: ImageGridBlock }) {
  if (block.images.length === 0) return null;
  return (
    <div className="mx-auto max-w-content px-6 md:px-10 py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {block.images.map((img, i) => (
          <img key={i} src={img.src} alt={img.alt} className="w-full object-cover h-48" />
        ))}
      </div>
    </div>
  );
}

function ReadCard({ block }: { block: CardBlock }) {
  const inner = (
    <div className="border border-light-gray bg-white p-6 hover:bg-background-soft transition-museum">
      <h3 className="font-display text-xl text-ink mb-2">{block.title}</h3>
      <p className="text-text-gray leading-relaxed">{block.body}</p>
    </div>
  );
  return (
    <div className="mx-auto max-w-content px-6 md:px-10 py-4">
      {block.href ? <a href={block.href}>{inner}</a> : inner}
    </div>
  );
}

function ReadCTA({ block }: { block: CTABlock }) {
  return (
    <div className={`mx-auto max-w-content px-6 md:px-10 py-4 flex ${block.align === "center" ? "justify-center" : block.align === "right" ? "justify-end" : "justify-start"}`}>
      <a href={block.href} className="border border-ink px-6 py-3 text-xs uppercase tracking-widest2 text-ink hover:bg-ink hover:text-white transition-museum">{block.text}</a>
    </div>
  );
}

function ReadDivider() {
  return <div className="mx-auto max-w-content px-6 md:px-10 py-4"><div className="section-rule" /></div>;
}

function ReadSpacer({ block }: { block: SpacerBlock }) {
  const heights: Record<SpacerBlock["size"], string> = { sm: "h-8", md: "h-16", lg: "h-32" };
  return <div className={heights[block.size]} />;
}

// ─── Block dispatcher ──────────────────────────────────────────────────────

function RenderBlock({ block, isAdmin, update }: { block: Block; isAdmin: boolean; update: (b: Block) => void }) {
  if (!isAdmin) {
    switch (block.type) {
      case "hero":              return <ReadHero block={block} />;
      case "intro":             return <ReadIntro block={block} />;
      case "research-question": return <ReadResearchQuestion block={block} />;
      case "methods":           return <ReadMethods block={block} />;
      case "page-heading":      return <ReadPageHeading block={block} />;
      case "method-section":    return <ReadMethodSection block={block} />;
      case "heading":           return <ReadHeading block={block} />;
      case "body":              return <ReadBody block={block} />;
      case "image":             return <ReadImage block={block} />;
      case "image-grid":        return <ReadImageGrid block={block} />;
      case "card":              return <ReadCard block={block} />;
      case "cta":               return <ReadCTA block={block} />;
      case "divider":           return <ReadDivider />;
      case "spacer":            return <ReadSpacer block={block} />;
    }
  }
  switch (block.type) {
    case "hero":              return <EditHero block={block} update={update as (b: HeroBlock) => void} />;
    case "intro":             return <EditIntro block={block} update={update as (b: IntroBlock) => void} />;
    case "research-question": return <EditResearchQuestion block={block} update={update as (b: ResearchQuestionBlock) => void} />;
    case "methods":           return <EditMethods block={block} update={update as (b: MethodsBlock) => void} />;
    case "page-heading":      return <EditPageHeading block={block} update={update as (b: PageHeadingBlock) => void} />;
    case "method-section":    return <EditMethodSection block={block} update={update as (b: MethodSectionBlock) => void} />;
    case "heading":           return <EditHeading block={block} update={update as (b: HeadingBlock) => void} />;
    case "body":              return <EditBody block={block} update={update as (b: BodyBlock) => void} />;
    case "image":             return <EditImage block={block} update={update as (b: ImageBlock) => void} />;
    case "image-grid":        return <EditImageGrid block={block} update={update as (b: ImageGridBlock) => void} />;
    case "card":              return <EditCard block={block} update={update as (b: CardBlock) => void} />;
    case "cta":               return <EditCTA block={block} update={update as (b: CTABlock) => void} />;
    case "divider":           return <ReadDivider />;
    case "spacer":            return <EditSpacer block={block} update={update as (b: SpacerBlock) => void} />;
  }
}

// ─── Main PageEditor component ─────────────────────────────────────────────

interface PageEditorProps {
  page: string;
  initialBlocks: Block[];
  isAdmin: boolean;
  children?: React.ReactNode; // extra static content (map canvas, timeline, etc.)
}

export default function PageEditor({ page, initialBlocks, isAdmin, children }: PageEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateBlock = useCallback((id: string, updated: Block) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? updated : b)));
    setSaved(false);
  }, []);

  const addBlock = useCallback((afterIndex: number, block: Block) => {
    setBlocks((prev) => {
      const next = [...prev];
      next.splice(afterIndex + 1, 0, block);
      return next;
    });
    setSaved(false);
  }, []);

  const moveBlock = useCallback((index: number, dir: -1 | 1) => {
    setBlocks((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setSaved(false);
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setSaved(false);
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/content/${page}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocks }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!isAdmin) {
    return (
      <div>
        {blocks.map((block) => (
          <RenderBlock key={block.id} block={block} isAdmin={false} update={() => {}} />
        ))}
        {children}
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 44 }}>
      <AdminBar saving={saving} saved={saved} onSave={save} />
      {blocks.map((block, i) => (
        <div key={block.id} className="relative group/block">
          {/* Block outline on hover */}
          <div className="absolute inset-0 pointer-events-none ring-2 ring-transparent group-hover/block:ring-blue-200 transition-all z-[100]" />

          <BlockControls
            canMoveUp={i > 0}
            canMoveDown={i < blocks.length - 1}
            onMoveUp={() => moveBlock(i, -1)}
            onMoveDown={() => moveBlock(i, 1)}
            onDelete={() => deleteBlock(block.id)}
          />

          <RenderBlock block={block} isAdmin update={(b) => updateBlock(block.id, b)} />

          <AddBlockButton onAdd={(b) => addBlock(i, b)} />
        </div>
      ))}
      {blocks.length === 0 && (
        <div className="relative py-4">
          <AddBlockButton onAdd={(b) => addBlock(-1, b)} />
        </div>
      )}
      {children}
    </div>
  );
}
