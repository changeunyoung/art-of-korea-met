import fs from "fs";
import path from "path";
import { PageContent, Block } from "./contentTypes";

const CONTENT_DIR = path.join(process.cwd(), "content");

const VALID_PAGES = ["home", "methodology", "map", "timeline", "text-analysis"];

function filePath(page: string): string {
  return path.join(CONTENT_DIR, `${page}.json`);
}

export function readContent(page: string): Block[] {
  if (!VALID_PAGES.includes(page)) return [];
  try {
    const raw = fs.readFileSync(filePath(page), "utf-8");
    const data: PageContent = JSON.parse(raw);
    return data.blocks ?? [];
  } catch {
    return [];
  }
}

export function writeContent(page: string, blocks: Block[]): void {
  if (!VALID_PAGES.includes(page)) throw new Error("Invalid page");
  const data: PageContent = { page, blocks };
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.writeFileSync(filePath(page), JSON.stringify(data, null, 2), "utf-8");
}
