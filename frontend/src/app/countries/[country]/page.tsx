import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Download,
  AlertCircle,
  TrendingUp,
  HeartPulse,
  Leaf,
  Users,
  Award,
  Layers,
  CheckCircle,
} from "lucide-react";
import DimensionBadge from "@/components/DimensionBadge";
import StatCard from "@/components/StatCard";
import ExportButton from "@/components/ExportButton";
import RadarComparison from "@/components/Charts/RadarComparison";
import BarChartBox from "@/components/Charts/BarChartBox";
import {
  getAllCountries,
  getCountryByName,
  getSummaryStats,
} from "@/lib/data";

interface CountryPageProps {
  params: {
    country: string;
  };
}

export function generateStaticParams() {
  const all = getAllCountries();
  return all.map((c) => ({
    country: encodeURIComponent(c.country),
  }));
}

export default function CountryProfilePage({ params }: CountryPageProps) {
  const decodedName = decodeURIComponent(params.country);
  const countryRecord = getCountryByName(decodedName);
  const summaryStats = getSummaryStats();

  if (!countryRecord) {
    notFound();
  }

  const { country, in_clean_dataset, in_index_dataset, raw, clean, index } =
    countryRecord;

  // Comparison against dataset median
  const indicatorsComparison = [
    {
      name: "GDP per capita",
      unit: "US$",
      value: clean ? clean.gdp_pc : null,
      median: summaryStats.GDPpc?.median ?? 6076,
      dimension: "Economic" as const,
      format: (v: number) => `$${Math.round(v).toLocaleString()}`,
    },
    {
      name: "Life Expectancy",
      unit: "years",
      value: clean ? clean.life_exp : null,
      median: summaryStats.LifeExp?.median ?? 73.9,
      dimension: "Health" as const,
      format: (v: number) => `${v.toFixed(1)} yrs`,
    },
    {
      name: "Infant Mortality",
      unit: "per 1,000",
      value: clean?.inf_mort ?? null,
      median: summaryStats.InfMort?.median ?? 13.8,
      dimension: "Health" as const,
      format: (v: number) => `${v.toFixed(1)} /1k`,
    },
    {
      name: "Physicians",
      unit: "per 1,000",
      value: clean?.physicians ?? null,
      median: summaryStats.Phys?.median ?? 1.54,
      dimension: "Health" as const,
      format: (v: number) => `${v.toFixed(2)} /1k`,
    },
    {
      name: "Unemployment",
      unit: "%",
      value: clean?.unemployment ?? null,
      median: summaryStats.Unemp?.median ?? 5.2,
      dimension: "Economic" as const,
      format: (v: number) => `${v.toFixed(1)}%`,
    },
    {
      name: "Tertiary Enrolment",
      unit: "%",
      value: clean?.tertiary ?? null,
      median: summaryStats.Tertiary?.median ?? 34.4,
      dimension: "Social" as const,
      format: (v: number) => `${v.toFixed(1)}%`,
    },
    {
      name: "CO₂ per capita",
      unit: "tonnes",
      value: clean?.co2_pc ?? null,
      median: summaryStats.CO2pc?.median ?? 2.42,
      dimension: "Environmental" as const,
      format: (v: number) => `${v.toFixed(2)} t`,
    },
    {
      name: "Forested Area",
      unit: "%",
      value: clean?.forest ?? null,
      median: summaryStats.Forest?.median ?? 31.7,
      dimension: "Environmental" as const,
      format: (v: number) => `${v.toFixed(1)}%`,
    },
  ];

  // Radar items
  const radarData = [
    {
      dimension: "Health",
      [country]: index ? index.health_score : 50,
      "Dataset Median": 50,
    },
    {
      dimension: "Social",
      [country]: index ? index.social_score : 50,
      "Dataset Median": 50,
    },
    {
      dimension: "Economic",
      [country]: index ? index.economic_score : 50,
      "Dataset Median": 50,
    },
    {
      dimension: "Environmental",
      [country]: index ? index.environmental_score : 50,
      "Dataset Median": 50,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between pb-4 border-b border-brand-border">
        <Link
          href="/countries"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-deepTeal hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Country Directory</span>
        </Link>

        <ExportButton
          data={[
            {
              Country: country,
              GDP_per_capita: clean?.gdp_pc ?? "Not available",
              Life_Expectancy: clean?.life_exp ?? "Not available",
              Infant_Mortality: clean?.inf_mort ?? "Not available",
              Physicians_per_1k: clean?.physicians ?? "Not available",
              Unemployment_pct: clean?.unemployment ?? "Not available",
              Tertiary_enrolment_pct: clean?.tertiary ?? "Not available",
              CO2_per_capita: clean?.co2_pc ?? "Not available",
              Forested_area_pct: clean?.forest ?? "Not available",
              Livability_Index: index?.index_score ?? "Not available",
              Index_Rank: index?.index_rank ?? "Not available",
              Rank_Shift: index?.rank_shift ?? "Not available",
              Wealth_Health_Residual: clean?.residual_life_exp ?? "Not available",
            },
          ]}
          filename={`profile_${country.toLowerCase().replace(/\s+/g, "_")}`}
          label="Export Country Record"
        />
      </div>

      {/* Hero Header */}
      <div className="editorial-card p-6 sm:p-8 bg-brand-navy text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs uppercase font-bold tracking-widest text-brand-mint">
                Country Analytical Dossier
              </span>
              <span className="text-gray-400 text-xs">• 2023 Dataset Snapshot</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              {country}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 font-mono">
              Income Category: {clean ? clean.income_quartile : "Excluded from Clean Set"}
            </p>
          </div>

          {/* Ranks & Index Card */}
          {index && (
            <div className="bg-brand-darkSurface/90 border border-brand-teal/40 rounded-xl p-4 sm:p-5 flex items-center space-x-6">
              <div>
                <p className="text-[11px] text-gray-400 uppercase font-sans">Livability Index</p>
                <p className="font-serif text-3xl font-bold text-brand-mint">
                  {index.index_score.toFixed(1)}
                  <span className="text-xs font-sans font-normal text-gray-400 ml-1">/ 100</span>
                </p>
                <p className="text-xs text-gray-300 font-mono mt-0.5">Rank #{index.index_rank} of 131</p>
              </div>

              <div className="border-l border-brand-teal/30 pl-6">
                <p className="text-[11px] text-gray-400 uppercase font-sans">GDP Rank Shift</p>
                <p
                  className={`font-serif text-3xl font-bold ${
                    index.rank_shift > 0
                      ? "text-emerald-400"
                      : index.rank_shift < 0
                      ? "text-rose-400"
                      : "text-gray-300"
                  }`}
                >
                  {index.rank_shift > 0 ? "+" : ""}
                  {index.rank_shift}
                </p>
                <p className="text-xs text-gray-300 font-mono mt-0.5">GDP #{index.gdp_rank}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Regression Residual & Outlier Status */}
      {clean && (
        <div className="editorial-card p-5 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-lg mt-0.5 ${
                clean.residual_life_exp >= 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-brand-navy">
                Wealth–Health Regression Analysis
              </h3>
              <p className="text-xs text-brand-textMuted mt-0.5">
                Model: Fitted Life Expectancy = −18.42 + 23.49 × log₁₀(GDP per capita).
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs font-mono">
            <div>
              <span className="text-brand-textMuted block font-sans">Predicted Life Exp:</span>
              <span className="font-semibold text-brand-navy">
                {clean.fitted_life_exp.toFixed(1)} yrs
              </span>
            </div>
            <div>
              <span className="text-brand-textMuted block font-sans">Observed Residual:</span>
              <span
                className={`font-bold ${
                  clean.residual_life_exp >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {clean.residual_life_exp >= 0 ? "+" : ""}
                {clean.residual_life_exp.toFixed(1)} years
              </span>
            </div>
            <div>
              <span className="text-brand-textMuted block font-sans">Residual Z-Score:</span>
              <span className="font-semibold text-brand-navy">
                {clean.residual_zscore.toFixed(2)} σ
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Radar Dimension Profile & Median Indicators Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Profile */}
        <div className="editorial-card p-6 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-brand-navy mb-1">
              Livability Balance
            </h3>
            <p className="text-xs text-brand-textMuted mb-4">
              Performance across the four dimensions relative to median baseline.
            </p>
            <RadarComparison
              data={radarData}
              countries={[
                { name: country, color: "#159A91" },
                { name: "Dataset Median", color: "#607D8B" },
              ]}
              height={280}
            />
          </div>

          {index && (
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-brand-border text-xs">
              <div className="p-2 rounded bg-brand-lightBg">
                <span className="text-brand-textMuted block">Health Score:</span>
                <span className="font-mono font-bold text-[#159A91]">
                  {index.health_score.toFixed(1)}
                </span>
              </div>
              <div className="p-2 rounded bg-brand-lightBg">
                <span className="text-brand-textMuted block">Social (Edu):</span>
                <span className="font-mono font-bold text-[#D9A441]">
                  {index.social_score.toFixed(1)}
                </span>
              </div>
              <div className="p-2 rounded bg-brand-lightBg">
                <span className="text-brand-textMuted block">Economic Score:</span>
                <span className="font-mono font-bold text-[#4777A8]">
                  {index.economic_score.toFixed(1)}
                </span>
              </div>
              <div className="p-2 rounded bg-brand-lightBg">
                <span className="text-brand-textMuted block">Environmental:</span>
                <span className="font-mono font-bold text-[#6B9D78]">
                  {index.environmental_score.toFixed(1)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Indicators vs Dataset Median Table */}
        <div className="editorial-card p-6 lg:col-span-2 overflow-x-auto">
          <h3 className="font-serif text-xl font-bold text-brand-navy mb-1">
            Core Indicators vs. Dataset Median
          </h3>
          <p className="text-xs text-brand-textMuted mb-4">
            Comparison of observed metrics against dataset 50th percentile (median country).
          </p>

          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-brand-textMuted font-semibold">
                <th className="py-2.5 pr-4">Dimension</th>
                <th className="py-2.5 px-3">Indicator</th>
                <th className="py-2.5 px-3 text-right">{country} Value</th>
                <th className="py-2.5 px-3 text-right">Dataset Median</th>
                <th className="py-2.5 pl-3 text-right">Comparison</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {indicatorsComparison.map((ind) => {
                const diff = ind.value !== null ? ind.value - ind.median : null;
                const isAvailable = ind.value !== null;
                return (
                  <tr key={ind.name} className="hover:bg-brand-lightBg/50">
                    <td className="py-3 pr-4">
                      <DimensionBadge dimension={ind.dimension} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-medium text-brand-navy">
                      {ind.name}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-brand-navy">
                      {isAvailable ? ind.format(ind.value!) : "Not available"}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-gray-500">
                      {ind.format(ind.median)}
                    </td>
                    <td className="py-3 pl-3 text-right font-mono">
                      {diff !== null ? (
                        <span
                          className={`font-semibold ${
                            ind.name === "Infant Mortality" ||
                            ind.name === "CO₂ per capita" ||
                            ind.name === "Unemployment"
                              ? diff <= 0
                                ? "text-emerald-600"
                                : "text-rose-600"
                              : diff >= 0
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {diff > 0 ? "+" : ""}
                          {diff.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Raw record audit */}
          <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between text-[11px] text-brand-textMuted">
            <span>
              Raw Records: GDP = ${raw.gdp_bn ?? "—"} bn, Pop = {raw.pop_m ?? "—"} m, CO₂ = {raw.co2_kt ?? "—"} kt
            </span>
            <Link
              href="/methodology"
              className="text-brand-deepTeal font-medium hover:underline"
            >
              Cleaning & Normalization Methodology →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
