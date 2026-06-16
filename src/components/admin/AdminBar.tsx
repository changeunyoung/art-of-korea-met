"use client";

import { useRouter } from "next/navigation";

interface AdminBarProps {
  saving: boolean;
  saved: boolean;
  onSave: () => void;
}

export default function AdminBar({ saving, saved, onSave }: AdminBarProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-6 py-2"
      style={{ background: "#1F2D3D", height: 44 }}
    >
      <span className="text-white text-xs uppercase tracking-widest2">
        ✏ 편집 모드
      </span>
      <div className="flex items-center gap-3">
        {saved && (
          <span className="text-xs text-green-400 uppercase tracking-widest2">저장됨</span>
        )}
        <button
          onClick={onSave}
          disabled={saving}
          className="text-xs uppercase tracking-widest2 px-4 py-1.5 border border-white text-white hover:bg-white hover:text-ink transition-museum disabled:opacity-50"
        >
          {saving ? "저장 중…" : "저장"}
        </button>
        <button
          onClick={handleLogout}
          className="text-xs uppercase tracking-widest2 px-4 py-1.5 text-white/60 hover:text-white transition-museum"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
