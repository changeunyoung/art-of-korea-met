import { readContent } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import PageEditor from "@/components/admin/PageEditor";
import MapCanvas from "@/components/map/MapCanvas";
import HotspotInfoPanel from "@/components/map/HotspotInfoPanel";
import MapInteractive from "@/components/map/MapInteractive";

export default async function InteractiveMapPage() {
  const blocks = readContent("map");
  const admin = await isAdmin();
  return (
    <div style={{ backgroundColor: "#DDE1E7", minHeight: "100vh" }}>
    <div className="mx-auto max-w-content px-6 md:px-10 py-16 md:py-20">
      <PageEditor page="map" initialBlocks={blocks} isAdmin={admin}>
        <div className="mt-12 rounded-sm overflow-hidden" style={{ backgroundColor: "#DDE1E7" }}>
          <div className="relative overflow-hidden mx-auto" style={{ maxWidth: "40%", aspectRatio: "4 / 2.75" }}>
            <video
              src="/videos/minimap.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full block"
              style={{ transform: "scale(1.06) translateY(-5%)", transformOrigin: "center center" }}
            />
            {/* bottom */}
            <div className="absolute bottom-0 left-0 right-0" style={{ height: "35%", background: "linear-gradient(to bottom, rgba(221,225,231,0) 0%, rgba(221,225,231,0.85) 60%, #DDE1E7 100%)" }} />
            {/* top */}
            <div className="absolute top-0 left-0 right-0" style={{ height: "25%", background: "linear-gradient(to top, rgba(221,225,231,0) 0%, rgba(221,225,231,0.85) 60%, #DDE1E7 100%)" }} />
            {/* left */}
            <div className="absolute top-0 left-0 bottom-0" style={{ width: "18%", background: "linear-gradient(to left, rgba(221,225,231,0) 0%, rgba(221,225,231,0.85) 60%, #DDE1E7 100%)" }} />
            {/* right */}
            <div className="absolute top-0 right-0 bottom-0" style={{ width: "18%", background: "linear-gradient(to right, rgba(221,225,231,0) 0%, rgba(221,225,231,0.85) 60%, #DDE1E7 100%)" }} />
          </div>
          <MapInteractive />
        </div>
      </PageEditor>
    </div>
    </div>
  );
}
