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
    <div style={{ backgroundColor: "#F1F3F6", minHeight: "100vh" }}>
    <div className="mx-auto max-w-content px-6 md:px-10 py-16 md:py-20">
      <PageEditor page="map" initialBlocks={blocks} isAdmin={admin}>
        <div className="mt-12 rounded-sm overflow-hidden" style={{ backgroundColor: "#F1F3F6" }}>
          <div className="overflow-hidden mx-auto" style={{ maxWidth: "40%" }}>
            <video
              src="/videos/minimap.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full block"
              style={{ transform: "scale(1.04) translateY(-3%)", transformOrigin: "center center" }}
            />
          </div>
          <MapInteractive />
        </div>
      </PageEditor>
    </div>
    </div>
  );
}
