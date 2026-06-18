import { readContent } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import PageEditor from "@/components/admin/PageEditor";
import MapCanvas from "@/components/map/MapCanvas";
import HotspotInfoPanel from "@/components/map/HotspotInfoPanel";
import MapInteractive from "@/components/map/MapInteractive";
import MinimapVideo from "@/components/map/MinimapVideo";

export default async function InteractiveMapPage() {
  const blocks = readContent("map");
  const admin = await isAdmin();
  return (
    <div style={{ backgroundColor: "#DDE1E7", minHeight: "100vh" }}>
    <div className="mx-auto max-w-content px-6 md:px-10 py-16 md:py-20">
      <PageEditor page="map" initialBlocks={blocks} isAdmin={admin}>
        <div className="mt-6 rounded-sm overflow-hidden" style={{ backgroundColor: "#DDE1E7" }}>
          <MinimapVideo />
          <div className="mt-24">
            <MapInteractive />
          </div>
        </div>
      </PageEditor>
    </div>
    </div>
  );
}
