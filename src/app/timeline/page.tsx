import { readContent } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import PageEditor from "@/components/admin/PageEditor";
import TimelineInteractive from "@/components/timeline/TimelineInteractive";

export default async function TimelinePage() {
  const blocks = readContent("timeline");
  const admin = await isAdmin();
  return (
    <div className="mx-auto max-w-content px-6 md:px-10 py-16 md:py-20">
      <PageEditor page="timeline" initialBlocks={blocks} isAdmin={admin}>
        <div className="mt-12">
          <TimelineInteractive />
        </div>
      </PageEditor>
    </div>
  );
}
