"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  TrendingUp,
  Table,
  Sliders,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import DimensionBadge from "@/components/DimensionBadge";
import StatCard from "@/components/StatCard";
import ScatterPlot from "@/components/Charts/ScatterPlot";
import CorrelationHeatmap from "@/components/Charts/CorrelationHeatmap";
import ExportButton from "@/components/ExportButton";

const RELATIONSHIP_PAIRS = [
  {
    id: "loggdp_lifeexp",
    title: "Wealth vs. Life Expectancy",
    xVar: "gdp_pc",
    yVar: "life_exp",
    xLabel: "GDP per capita (US$, log scale)",
    yLabel: "Life Expectancy (years)",
    xScale: "log" as const,
    yScale: "auto" as const,
    xUnit: "$",
    yUnit: "yrs",
    expectedR: "0.83",
    description: "Each doubling of GDP per capita buys approx. +3 years of life before plateauing.",
  },
  {
    id: "loggdp_co2",
    title: "Wealth vs. CO₂ Emissions (Trade-off)",
    xVar: "gdp_pc",
    yVar: "co2_pc",
    xLabel: "GDP per capita (US$, log scale)",
    yLabel: "CO₂ per capita (tonnes, log scale)",
    xScale: "log" as const,
    yScale: "log" as const,
    xUnit: "$",
    yUnit: "t",
    expectedR: "0.87 (log-log)",
    description: "Prosperity is strongly coupled with emissions across both low and high-income states.",
  },
  {
    id: "infmort_lifeexp",
    title: "Infant Mortality vs. Life Expectancy",
    xVar: "inf_mort",
    yVar: "life_exp",
    xLabel: "Infant Mortality (per 1,000 live births)",
    yLabel: "Life Expectancy (years)",
    xScale: "auto" as const,
    yScale: "auto" as const,
    xUnit: "/1k",
    yUnit: "yrs",
    expectedR: "-0.93",
    description: "The strongest bivariate relationship in the study. Early childhood survival drives national longevity.",
  },
  {
    id: "phys_lifeexp",
    title: "Healthcare Availability vs. Life Expectancy",
    xVar: "physicians",
    yVar: "life_exp",
    xLabel: "Physicians (per 1,000 people)",
    yLabel: "Life Expectancy (years)",
    xScale: "auto" as const,
    yScale: "auto" as const,
    xUnit: "/1k",
    yUnit: "yrs",
    expectedR: "0.67",
    description: "Clinical workforce density correlates with health outcomes, especially in developing regions.",
  },
  {
    id: "tertiary_lifeexp",
    title: "Tertiary Education vs. Life Expectancy",
    xVar: "tertiary",
    yVar: "life_exp",
    xLabel: "Tertiary Enrolment (Gross %, max 100)",
    yLabel: "Life Expectancy (years)",
    xScale: "auto" as const,
    yScale: "auto" as const,
    xUnit: "%",
    yUnit: "yrs",
    expectedR: "0.72",
    description: "Higher education tracking correlates positively with health and institutional capacity.",
  },
  {
    id: "unemp_gdp",
    title: "Unemployment vs. GDP per Capita",
    xVar: "gdp_pc",
    yVar: "unemployment",
    xLabel: "GDP per capita (US$, log scale)",
    yLabel: "Unemployment Rate (%)",
    xScale: "log" as const,
    yScale: "auto" as const,
    xUnit: "$",
    yUnit: "%",
    expectedR: "0.04",
    description: "Virtually zero correlation (~0.04). Being an economically rich country does not solve unemployment.",
  },
  {
    id: "forest_gdp",
    title: "Forest Cover vs. GDP per Capita",
    xVar: "gdp_pc",
    yVar: "forest",
    xLabel: "GDP per capita (US$, log scale)",
    yLabel: "Forested Land Area (%)",
    xScale: "log" as const,
    yScale: "auto" as const,
    xUnit: "$",
    yUnit: "%",
    expectedR: "0.08",
    description: "Near-zero correlation (0.08). Forest cover is dictated by geography and biome, not GDP.",
  },
];

export default function RelationshipsPage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [correlations, setCorrelations] = useState<any>(null);
  const [selectedPairId, setSelectedPairId] = useState("loggdp_lifeexp");
  const [heatmapMethod, setHeatmapMethod] = useState<"pearson" | "spearman">("pearson");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/countries.json").then((r) => r.json()),
      fetch("/data/correlations.json").then((r) => r.json()),
    ])
      .then(([cData, corrData]) => {
        setCountries(cData.filter((c: any) => c.in_clean_dataset && c.clean));
        setCorrelations(corrData);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const activePair = useMemo(() => {
    return (
      RELATIONSHIP_PAIRS.find((p) => p.id === selectedPairId) ||
      RELATIONSHIP_PAIRS[0]
    );
  }, [selectedPairId]);

  // Scatter points for active pair
  const scatterPoints = useMemo(() => {
    return countries
      .map((c) => {
        const xVal = c.clean[activePair.xVar];
        const yVal = c.clean[activePair.yVar];
        if (xVal === null || yVal === null || xVal === undefined || yVal === undefined) {
          return null;
        }
        if (activePair.xScale === "log" && xVal <= 0) return null;
        if (activePair.yScale === "log" && yVal <= 0) return null;

        return {
          country: c.country,
          x: xVal,
          y: yVal,
          highlight: ["Qatar", "Equatorial Guinea", "Belarus", "Finland"].includes(c.country),
        };
      })
      .filter(Boolean) as any[];
  }, [countries, activePair]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-brand-navy">Loading Relationship Explorer...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-border">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-deepTeal">
              Multivariate & Correlation Engine
            </span>
            <span className="text-xs text-brand-textMuted">• Pearson & Spearman Formulations</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mt-1">
            Correlation & Bivariate Explorer
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted mt-1">
            Discover which livability dimensions move in sync, which diverge, and which show zero relationship with GDP.
          </p>
        </div>

        <ExportButton
          data={correlations ? correlations.variables.map((v: string, i: number) => {
            const row: any = { Variable: correlations.labels[i] };
            correlations.labels.forEach((lbl: string, j: number) => {
              row[lbl] = correlations[heatmapMethod][i][j];
            });
            return row;
          }) : []}
          filename={`beyond_gdp_correlations_${heatmapMethod}`}
          label={`Export ${heatmapMethod === "pearson" ? "Pearson" : "Spearman"} Matrix CSV`}
        />
      </div>

      {/* 1. Correlation Heatmap Section */}
      <div className="editorial-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-brand-border">
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-navy">
              Multidimensional Correlation Matrix
            </h2>
            <p className="text-xs text-brand-textMuted mt-0.5">
              Pairwise correlations across log GDP pc, health, education, emissions, and forest cover.
            </p>
          </div>

          <div className="flex items-center space-x-2 mt-3 sm:mt-0 text-xs">
            <span className="text-brand-textMuted font-medium">Method:</span>
            <button
              onClick={() => setHeatmapMethod("pearson")}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                heatmapMethod === "pearson"
                  ? "bg-brand-navy text-white shadow-sm"
                  : "bg-brand-lightBg text-brand-textMuted border border-brand-border"
              }`}
            >
              Pearson (Linear)
            </button>
            <button
              onClick={() => setHeatmapMethod("spearman")}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                heatmapMethod === "spearman"
                  ? "bg-brand-navy text-white shadow-sm"
                  : "bg-brand-lightBg text-brand-textMuted border border-brand-border"
              }`}
            >
              Spearman (Rank)
            </button>
          </div>
        </div>

        {correlations && (
          <CorrelationHeatmap
            variables={correlations.variables}
            labels={correlations.labels}
            matrix={correlations[heatmapMethod]}
            methodName={heatmapMethod === "pearson" ? "Pearson" : "Spearman"}
          />
        )}
      </div>

      {/* 2. Interactive Bivariate Scatter Explorer */}
      <div className="editorial-card p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-brand-navy">
            Bivariate Relationship Explorer
          </h2>
          <p className="text-xs text-brand-textMuted mt-1">
            Select a verified project relationship below to inspect observations, trend shape, and transformation scale.
          </p>
        </div>

        {/* Relationship Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          {RELATIONSHIP_PAIRS.map((pair) => (
            <button
              key={pair.id}
              onClick={() => setSelectedPairId(pair.id)}
              className={`p-3 text-left rounded-lg border transition flex flex-col justify-between ${
                selectedPairId === pair.id
                  ? "border-brand-teal bg-brand-lightBg ring-1 ring-brand-teal text-brand-navy font-semibold"
                  : "border-brand-border bg-white text-brand-textMuted hover:border-brand-teal/40"
              }`}
            >
              <div>
                <p className="font-serif text-sm font-bold text-brand-navy">{pair.title}</p>
                <p className="text-[11px] text-brand-textMuted mt-1">{pair.description}</p>
              </div>
              <div className="mt-2 pt-2 border-t border-brand-border/60 flex items-center justify-between font-mono text-[11px]">
                <span className="text-brand-deepTeal">r ≈ {pair.expectedR}</span>
                <span className="text-gray-400">{pair.xScale === "log" ? "log axis" : "linear"}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Active Scatter Visualizer */}
        <div className="pt-4 border-t border-brand-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-brand-navy">
                {activePair.title}
              </h3>
              <p className="text-xs text-brand-textMuted">
                {scatterPoints.length} valid country pairs. Coral dots represent highlighted cases.
              </p>
            </div>
            <div className="text-xs font-mono px-3 py-1 bg-brand-lightBg border border-brand-border rounded-md text-brand-navy mt-2 sm:mt-0">
              Verified r = {activePair.expectedR}
            </div>
          </div>

          <ScatterPlot
            data={scatterPoints}
            xAxisLabel={activePair.xLabel}
            yAxisLabel={activePair.yLabel}
            xScale={activePair.xScale}
            yScale={activePair.yScale}
            xUnit={activePair.xUnit}
            yUnit={activePair.yUnit}
            highlightCountries={["Qatar", "Equatorial Guinea", "Belarus", "Finland"]}
            height={440}
          />
        </div>
      </div>

      {/* 3. Research Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="editorial-card p-5 border-l-4 border-l-brand-teal">
          <h4 className="font-serif text-base font-bold text-brand-navy mb-1">
            Strong Health Synergies (r = −0.93)
          </h4>
          <p className="text-xs text-brand-textMuted leading-relaxed">
            Infant mortality and life expectancy represent two sides of the same coin.
            Healthcare improvements deliver rapid mortality reductions in low-income quartiles.
          </p>
        </div>

        <div className="editorial-card p-5 border-l-4 border-l-brand-coral">
          <h4 className="font-serif text-base font-bold text-brand-navy mb-1">
            The Decoupled Labor Market (r = 0.04)
          </h4>
          <p className="text-xs text-brand-textMuted leading-relaxed">
            GDP per capita shows zero meaningful correlation with unemployment rate.
            High wealth does not insulate countries like Greece or Spain from high structural unemployment.
          </p>
        </div>

        <div className="editorial-card p-5 border-l-4 border-l-brand-amber">
          <h4 className="font-serif text-base font-bold text-brand-navy mb-1">
            Geographic Forest Independence (r = 0.08)
          </h4>
          <p className="text-xs text-brand-textMuted leading-relaxed">
            Forest cover is decoupled from macroeconomic expansion. National forestation is determined
            by climatic biome and topography, not capital accumulation.
          </p>
        </div>
      </div>
    </div>
  );
}
