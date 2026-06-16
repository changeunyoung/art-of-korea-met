import { readContent } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import PageEditor from "@/components/admin/PageEditor";

export default async function MethodologyPage() {
  const blocks = readContent("methodology");
  const admin = await isAdmin();
  return (
    <div className="mx-auto max-w-content px-6 md:px-10 py-16 md:py-20">
      <PageEditor page="methodology" initialBlocks={blocks} isAdmin={admin} />
    </div>
  );
}
