"use client";

import { useState } from "react";
import BlockPicker from "./BlockPicker";
import { Block } from "@/lib/contentTypes";

interface AddBlockButtonProps {
  onAdd: (block: Block) => void;
}

export default function AddBlockButton({ onAdd }: AddBlockButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-center py-1 group/add">
      {/* Dashed line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px border-t border-dashed border-transparent group-hover/add:border-blue-300 transition-all" />

      {/* + button */}
      <button
        onClick={() => setOpen(true)}
        className="relative z-10 w-7 h-7 rounded-full bg-white border-2 border-transparent group-hover/add:border-blue-400 text-transparent group-hover/add:text-blue-500 flex items-center justify-center text-lg font-light transition-all leading-none shadow-sm group-hover/add:shadow-md"
        title="블록 추가"
      >
        +
      </button>

      {open && (
        <BlockPicker
          onSelect={(block) => { onAdd(block); setOpen(false); }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
