"use client";

export default function FilmRoll() {
  return (
    <div style={{ overflow: "hidden", width: "100%", backgroundColor: "#F4F7FA", paddingTop: "48px", paddingBottom: "48px" }}>
      <style>{`
        @keyframes film-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .film-track {
          display: flex;
          width: max-content;
          animation: film-scroll 20s linear infinite;
        }
      `}</style>
      <div className="film-track">
        {[0, 1].map(i => (
          <div key={i} style={{ width: 1658, flexShrink: 0 }}>
            <img src="/images/gallery/scrollbg.png" alt="Korean Gallery" style={{ width: 1658, height: 700, display: "block" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
