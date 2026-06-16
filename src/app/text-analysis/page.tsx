import { readContent } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import PageEditor from "@/components/admin/PageEditor";
import TextAnalysisInteractive from "@/components/textanalysis/TextAnalysisInteractive";

export default async function TextAnalysisPage() {
  const blocks = readContent("text-analysis");
  const admin = await isAdmin();
  return (
    <div className="mx-auto max-w-content px-6 md:px-10 py-16 md:py-20">
      <PageEditor page="text-analysis" initialBlocks={blocks} isAdmin={admin}>
        <TextAnalysisInteractive />
      </PageEditor>
    </div>
  );
}
