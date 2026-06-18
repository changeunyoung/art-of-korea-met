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
    <div style={{ backgroundColor: "#E5E8EF", minHeight: "100vh" }}>
    <div className="mx-auto max-w-content px-6 md:px-10 py-16 md:py-20">
      <PageEditor page="map" initialBlocks={blocks} isAdmin={admin}>
        <div className="mt-12 rounded-sm overflow-hidden" style={{ backgroundColor: "#E5E8EF" }}>
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
            <div className="absolute bottom-0 left-0 right-0" style={{ height: "35%", background: "linear-gradient(to bottom, rgba(229,232,239,0) 0%, rgba(229,232,239,0.85) 60%, #E5E8EF 100%)" }} />
          </div>
          <MapInteractive />
        </div>
      </PageEditor>
    </div>
    </div>
  );
}
