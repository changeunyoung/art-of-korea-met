import { readContent } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import PageEditor from "@/components/admin/PageEditor";
import TimelineInteractive from "@/components/timeline/TimelineInteractive";

export default async function TimelinePage() {
  const blocks = readContent("timeline");
  const admin = await isAdmin();
  return (
    <div
      style={{
        background: "#B2D8F0",
        minHeight: "100vh",
        marginTop: "-80px",
        paddingTop: "calc(80px + 5rem)",
        paddingBottom: "6rem",
      }}
    >
      <div className="mx-auto max-w-content px-6 md:px-10 max-lg:[&_*]:!text-white max-lg:[&_.section-rule]:!bg-white">
        <PageEditor page="timeline" initialBlocks={blocks} isAdmin={admin}>
          <div className="mt-2">
            <TimelineInteractive />
          </div>
        </PageEditor>
      </div>
    </div>
  );
}
