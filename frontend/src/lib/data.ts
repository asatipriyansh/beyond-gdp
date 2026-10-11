import fs from "fs";
import path from "path";
import {
  CountryRecord,
  SummaryStats,
  CorrelationsData,
  OutliersData,
  IndexRankingsData,
  IncomeQuartiles,
} from "./types";

const possibleDataDirs = [
  path.join(process.cwd(), "public/data"),
  path.join(process.cwd(), "frontend/public/data"),
];
const dataDir = possibleDataDirs.find((d) => fs.existsSync(d)) || possibleDataDirs[0];

function readJsonFile<T>(filename: string): T {
  const filePath = path.join(dataDir, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function getAllCountries(): CountryRecord[] {
  return readJsonFile<CountryRecord[]>("countries.json");
}

export function getCleanCountries(): CountryRecord[] {
  const all = getAllCountries();
  return all.filter((c) => c.in_clean_dataset && c.clean !== null);
}

export function getCountryByName(name: string): CountryRecord | undefined {
  const decoded = decodeURIComponent(name).toLowerCase();
  const all = getAllCountries();
  return all.find(
    (c) =>
      c.country.toLowerCase() === decoded ||
      c.country.toLowerCase().replace(/\s+/g, "-") === decoded
  );
}

export function getSummaryStats(): SummaryStats {
  return readJsonFile<SummaryStats>("summary_stats.json");
}

export function getCorrelations(): CorrelationsData {
  return readJsonFile<CorrelationsData>("correlations.json");
}

export function getOutliers(): OutliersData {
  return readJsonFile<OutliersData>("outliers.json");
}

export function getIndexRankings(): IndexRankingsData {
  return readJsonFile<IndexRankingsData>("index_rankings.json");
}

export function getIncomeQuartiles(): IncomeQuartiles {
  return readJsonFile<IncomeQuartiles>("income_quartiles.json");
}

export function getRawMetadata(): any {
  return readJsonFile<any>("raw_metadata.json");
}
