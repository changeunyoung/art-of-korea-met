"use client";

import { Block } from "@/lib/contentTypes";

const BLOCK_TYPES = [
  { type: "heading",     icon: "H",  label: "제목" },
  { type: "body",        icon: "¶",  label: "본문" },
  { type: "image",       icon: "🖼", label: "이미지" },
  { type: "image-grid",  icon: "⊞",  label: "이미지 그리드" },
  { type: "card",        icon: "◻",  label: "카드" },
  { type: "cta",         icon: "→",  label: "CTA" },
  { type: "divider",     icon: "—",  label: "구분선" },
  { type: "spacer",      icon: "↕",  label: "여백" },
] as const;

function makeBlock(type: string): Block {
  const id = `block-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  switch (type) {
    case "heading":    return { id, type: "heading",    text: "새 제목", level: "h2", align: "left" };
    case "body":       return { id, type: "body",       text: "본문 텍스트를 입력하세요.", align: "left" };
    case "image":      return { id, type: "image",      src: "", alt: "" };
    case "image-grid": return { id, type: "image-grid", images: [] };
    case "card":       return { id, type: "card",       title: "카드 제목", body: "카드 내용" };
    case "cta":        return { id, type: "cta",        text: "링크 텍스트", href: "/", align: "center" };
    case "divider":    return { id, type: "divider" };
    case "spacer":     return { id, type: "spacer",     size: "md" };
    default:           return { id, type: "body",       text: "", align: "left" };
  }
}

interface BlockPickerProps {
  onSelect: (block: Block) => void;
  onClose: () => void;
}

export default function BlockPicker({ onSelect, onClose }: BlockPickerProps) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[10000]" onClick={onClose} />

      {/* Picker panel */}
      <div className="absolute z-[10001] top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-light-gray shadow-xl p-4 min-w-[260px]">
        <p className="text-xs uppercase tracking-widest2 text-text-gray mb-3">블록 추가</p>
        <div className="grid grid-cols-2 gap-2">
          {BLOCK_TYPES.map(({ type, icon, label }) => (
            <button
              key={type}
              onClick={() => onSelect(makeBlock(type))}
              className="flex items-center gap-2 px-3 py-2 border border-light-gray text-sm text-ink hover:border-ink hover:bg-background-soft transition-museum text-left"
            >
              <span className="w-5 text-center text-text-gray">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
