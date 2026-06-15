import Papa from "papaparse";
import * as XLSX from "xlsx";
import { TimelineEntry } from "./types";

const REQUIRED_COLUMNS = ["Year", "Title", "Description", "Category"] as const;

function rowsToEntries(rows: Record<string, unknown>[]): TimelineEntry[] {
  return rows
    .filter((row) => row["Year"] !== undefined && String(row["Year"]).trim() !== "")
    .map((row) => ({
      year: String(row["Year"] ?? "").trim(),
      title: String(row["Title"] ?? "").trim(),
      description: String(row["Description"] ?? "").trim(),
      category: String(row["Category"] ?? "").trim(),
      media: String(row["Media"] ?? "").trim(),
      mediaCredit: String(row["Media Credit"] ?? "").trim(),
      mediaCaption: String(row["Media Caption"] ?? "").trim(),
    }));
}

export function validateColumns(headers: string[]): string | null {
  const missing = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
  if (missing.length > 0) {
    return `Missing required column(s): ${missing.join(", ")}. Expected columns: ${REQUIRED_COLUMNS.join(
      ", "
    )}.`;
  }
  return null;
}

export function parseCSV(file: File): Promise<TimelineEntry[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields ?? [];
        const error = validateColumns(headers);
        if (error) {
          reject(new Error(error));
          return;
        }
        resolve(rowsToEntries(results.data));
      },
      error: (err) => reject(err),
    });
  });
}

export function parseExcel(file: File): Promise<TimelineEntry[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
        const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
        const error = validateColumns(headers);
        if (error) {
          reject(new Error(error));
          return;
        }
        resolve(rowsToEntries(rows));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsBinaryString(file);
  });
}

export function parseTimelineFile(file: File): Promise<TimelineEntry[]> {
  const isExcel = /\.(xlsx|xls)$/i.test(file.name);
  return isExcel ? parseExcel(file) : parseCSV(file);
}

export async function loadDefaultTimeline(): Promise<TimelineEntry[]> {
  const res = await fetch("/data/timeline-sample.csv");
  const text = await res.text();
  return new Promise((resolve) => {
    Papa.parse<Record<string, unknown>>(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(rowsToEntries(results.data)),
    });
  });
}
