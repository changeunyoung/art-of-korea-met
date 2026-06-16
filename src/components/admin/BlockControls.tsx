"use client";

interface BlockControlsProps {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

export default function BlockControls({
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDelete,
}: BlockControlsProps) {
  return (
    <div className="absolute right-2 top-2 z-[200] flex flex-col gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
      <button
        onClick={onMoveUp}
        disabled={!canMoveUp}
        title="위로"
        className="w-7 h-7 bg-white border border-light-gray text-ink text-xs flex items-center justify-center hover:border-ink transition-museum disabled:opacity-30"
      >
        ↑
      </button>
      <button
        onClick={onMoveDown}
        disabled={!canMoveDown}
        title="아래로"
        className="w-7 h-7 bg-white border border-light-gray text-ink text-xs flex items-center justify-center hover:border-ink transition-museum disabled:opacity-30"
      >
        ↓
      </button>
      <button
        onClick={onDelete}
        title="삭제"
        className="w-7 h-7 bg-white border border-light-gray text-red-500 text-xs flex items-center justify-center hover:border-red-500 transition-museum"
      >
        ✕
      </button>
    </div>
  );
}
