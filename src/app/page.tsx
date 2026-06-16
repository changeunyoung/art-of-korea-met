import { readContent } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import PageEditor from "@/components/admin/PageEditor";

export default async function HomePage() {
  const blocks = readContent("home");
  const admin = await isAdmin();
  return <PageEditor page="home" initialBlocks={blocks} isAdmin={admin} />;
}
