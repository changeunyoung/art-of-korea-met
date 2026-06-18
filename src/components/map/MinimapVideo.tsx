export default function MinimapVideo() {
  const videoStyle: React.CSSProperties = {
    position: "absolute", top: 0, left: 0, width: "100%",
    transform: "scale(1.06) translateY(-5%)",
    transformOrigin: "center center",
  };

  return (
    <div className="relative mx-auto" style={{ maxWidth: "55%" }}>
      <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 2.75" }}>
        <video src="/videos/minimap_pingpong.mp4" muted playsInline autoPlay loop preload="auto" style={videoStyle} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: "20%", background: "linear-gradient(to bottom, rgba(221,225,231,0) 0%, rgba(221,225,231,0.85) 60%, #DDE1E7 100%)" }} />
        <div className="absolute top-0 left-0 right-0" style={{ height: "25%", background: "linear-gradient(to top, rgba(221,225,231,0) 0%, rgba(221,225,231,0.85) 60%, #DDE1E7 100%)" }} />
        <div className="absolute top-0 left-0 bottom-0" style={{ width: "18%", background: "linear-gradient(to left, rgba(221,225,231,0) 0%, rgba(221,225,231,0.85) 60%, #DDE1E7 100%)" }} />
        <div className="absolute top-0 right-0 bottom-0" style={{ width: "18%", background: "linear-gradient(to right, rgba(221,225,231,0) 0%, rgba(221,225,231,0.85) 60%, #DDE1E7 100%)" }} />
        <p
          className="absolute top-14 left-0 right-0 text-center text-xs uppercase tracking-widest2 text-blue-500 z-10 drop-shadow-md"
          style={{ transform: "translateX(40px) rotate(9deg)", opacity: 0, animation: "fadeIn 1s ease forwards 2s" }}
        >Scroll Down</p>
      </div>
    </div>
  );
}
