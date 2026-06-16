import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/content";
import { Block } from "@/lib/contentTypes";

interface Params {
  params: Promise<{ page: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { page } = await params;
  const blocks = readContent(page);
  return NextResponse.json({ blocks });
}

export async function POST(req: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { page } = await params;
  const { blocks }: { blocks: Block[] } = await req.json();
  writeContent(page, blocks);
  return NextResponse.json({ ok: true });
}
