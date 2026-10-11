"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Leaf,
  Factory,
  TrendingUp,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
} from "lucide-react";
import DimensionBadge from "@/components/DimensionBadge";
import StatCard from "@/components/StatCard";
import ScatterPlot from "@/components/Charts/ScatterPlot";
import BarChartBox from "@/components/Charts/BarChartBox";
import ExportButton from "@/components/ExportButton";

export default function EnvironmentTradeoffsPage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [incomeQuartiles, setIncomeQuartiles] = useState<any>(null);
  const [correlations, setCorrelations] = useState<any>(null);
  const [scaleMode, setScaleMode] = useState<"log" | "auto">("log");
  const [activeAnalysis, setActiveAnalysis] = useState<"gdp_co2" | "co2_lifeexp" | "gdp_forest">("gdp_co2");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/countries.json").then((r) => r.json()),
      fetch("/data/income_quartiles.json").then((r) => r.json()),
      fetch("/data/correlations.json").then((r) => r.json()),
    ])
      .then(([cData, qData, corrData]) => {
        setCountries(cData.filter((c: any) => c.in_clean_dataset && c.clean));
        setIncomeQuartiles(qData);
        setCorrelations(corrData);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // Income quartile median emissions bar chart
  const quartileBarData = useMemo(() => {
    if (!incomeQuartiles) return [];
    return Object.entries(incomeQuartiles).map(([qName, qData]: any) => ({
      name: qName.split(" ")[0],
      "Median CO₂ (t)": qData.median_co2,
      "Median GDP ($)": qData.median_gdp,
    }));
  }, [incomeQuartiles]);

  // Scatter data based on active analysis
  const scatterData = useMemo(() => {
    return countries
      .map((c) => {
        if (!c.clean) return null;

        if (activeAnalysis === "gdp_co2") {
          if (!c.clean.co2_pc || c.clean.co2_pc <= 0) return null;
          return {
            country: c.country,
            x: c.clean.gdp_pc,
            y: c.clean.co2_pc,
            highlight: ["Qatar", "Kuwait", "Brunei", "Luxembourg", "Canada", "Australia"].includes(c.country),
          };
        } else if (activeAnalysis === "co2_lifeexp") {
          if (!c.clean.co2_pc || c.clean.co2_pc <= 0) return null;
          return {
            country: c.country,
            x: c.clean.co2_pc,
            y: c.clean.life_exp,
            highlight: ["Qatar", "Equatorial Guinea", "Nicaragua", "Japan"].includes(c.country),
          };
        } else {
          // gdp_forest
          if (c.clean.forest === null) return null;
          return {
            country: c.country,
            x: c.clean.gdp_pc,
            y: c.clean.forest,
            highlight: ["Gabon", "Guyana", "Finland", "Qatar", "Oman"].includes(c.country),
          };
        }
      })
      .filter(Boolean) as any[];
  }, [countries, activeAnalysis]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-brand-navy">Loading Environmental Trade-offs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-border">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#6B9D78]">
              Environmental Dimension & Ecological Debt
            </span>
            <span className="text-xs text-brand-textMuted">• Verified Trade-Off Analytics</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mt-1">
            Economic–Environmental Trade-offs
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted mt-1">
            Does living better mean polluting more? Examining how prosperity correlates with national carbon footprints and biome preservation.
          </p>
        </div>

        <ExportButton
          data={countries.map((c) => ({
            Country: c.country,
            GDP_per_capita: c.clean.gdp_pc,
            CO2_per_capita: c.clean.co2_pc,
            Life_Expectancy: c.clean.life_exp,
            Forest_pct: c.clean.forest,
            Income_Quartile: c.clean.income_quartile,
          }))}
          filename="beyond_gdp_environmental_tradeoffs"
          label="Export Environmental Data CSV"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Log-Log Correlation"
          value="r = 0.87"
          subtext="Strongest environmental link with log GDP"
          badge="log GDP vs log CO₂"
          dimensionColor="#6B9D78"
          icon={Factory}
        />
        <StatCard
          title="Quartile Carbon Jump"
          value="27× Increase"
          subtext="0.26 t (Q1 median) to 7.10 t (Q4 median)"
          badge="Development Tax"
          dimensionColor="#E47D62"
          icon={AlertTriangle}
        />
        <StatCard
          title="Emissions vs Longevity"
          value="r = 0.75"
          subtext="High CO₂ countries have higher life exp."
          badge="The Prosperity Paradox"
          dimensionColor="#159A91"
          icon={TrendingUp}
        />
        <StatCard
          title="Forest Cover Independence"
          value="r = 0.08"
          subtext="National tree cover is unrelated to GDP"
          badge="Biome Dependent"
          dimensionColor="#4777A8"
          icon={Leaf}
        />
      </div>

      {/* Main Trade-off Visualization */}
      <div className="editorial-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-border gap-3">
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-navy">
              Trade-off Relationship Studio
            </h2>
            <p className="text-xs text-brand-textMuted mt-0.5">
              Select an analytical lens and toggle scaling to observe structural trends.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center space-x-1 bg-brand-lightBg p-1 rounded-md border border-brand-border">
              <button
                onClick={() => setActiveAnalysis("gdp_co2")}
                className={`px-3 py-1 rounded font-medium transition ${
                  activeAnalysis === "gdp_co2"
                    ? "bg-brand-navy text-white shadow-sm"
                    : "text-brand-textMuted hover:text-brand-navy"
                }`}
              >
                GDP vs. CO₂ (r=0.87)
              </button>
              <button
                onClick={() => setActiveAnalysis("co2_lifeexp")}
                className={`px-3 py-1 rounded font-medium transition ${
                  activeAnalysis === "co2_lifeexp"
                    ? "bg-brand-navy text-white shadow-sm"
                    : "text-brand-textMuted hover:text-brand-navy"
                }`}
              >
                CO₂ vs. Life Exp (r=0.75)
              </button>
              <button
                onClick={() => setActiveAnalysis("gdp_forest")}
                className={`px-3 py-1 rounded font-medium transition ${
                  activeAnalysis === "gdp_forest"
                    ? "bg-brand-navy text-white shadow-sm"
                    : "text-brand-textMuted hover:text-brand-navy"
                }`}
              >
                GDP vs. Forest (r=0.08)
              </button>
            </div>

            {activeAnalysis === "gdp_co2" && (
              <div className="flex items-center space-x-1 bg-white p-1 rounded-md border border-brand-border">
                <button
                  onClick={() => setScaleMode("log")}
                  className={`px-2.5 py-1 rounded font-semibold transition ${
                    scaleMode === "log" ? "bg-brand-teal text-white" : "text-brand-textMuted"
                  }`}
                >
                  Log-Log
                </button>
                <button
                  onClick={() => setScaleMode("auto")}
                  className={`px-2.5 py-1 rounded font-semibold transition ${
                    scaleMode === "auto" ? "bg-brand-teal text-white" : "text-brand-textMuted"
                  }`}
                >
                  Linear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scatter Visualizer */}
        <ScatterPlot
          data={scatterData}
          xAxisLabel={
            activeAnalysis === "gdp_co2"
              ? `GDP per capita (US$${scaleMode === "log" ? ", log scale" : ""})`
              : activeAnalysis === "co2_lifeexp"
              ? "CO₂ emissions per capita (tonnes, log scale)"
              : "GDP per capita (US$, log scale)"
          }
          yAxisLabel={
            activeAnalysis === "gdp_co2"
              ? `CO₂ per capita (tonnes${scaleMode === "log" ? ", log scale" : ""})`
              : activeAnalysis === "co2_lifeexp"
              ? "Life Expectancy (years)"
              : "Forested Land Area (%)"
          }
          xScale={
            activeAnalysis === "gdp_co2"
              ? scaleMode
              : activeAnalysis === "co2_lifeexp"
              ? "log"
              : "log"
          }
          yScale={activeAnalysis === "gdp_co2" && scaleMode === "log" ? "log" : "auto"}
          highlightCountries={
            activeAnalysis === "gdp_co2"
              ? ["Qatar", "Kuwait", "Brunei", "Luxembourg", "Canada", "Australia"]
              : ["Qatar", "Equatorial Guinea", "Nicaragua", "Japan"]
          }
          height={460}
          xUnit={activeAnalysis === "co2_lifeexp" ? "t" : "$"}
          yUnit={activeAnalysis === "gdp_co2" ? "t" : activeAnalysis === "co2_lifeexp" ? "yrs" : "%"}
        />
      </div>

      {/* Income Quartile Carbon Jump Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="editorial-card p-6">
          <div className="mb-4 pb-3 border-b border-brand-border">
            <h3 className="font-serif text-xl font-bold text-brand-navy">
              Median Carbon Output by Income Quartile
            </h3>
            <p className="text-xs text-brand-textMuted">
              Metric tonnes of CO₂ per capita across income tiers (141 countries).
            </p>
          </div>
          <BarChartBox
            data={quartileBarData}
            dataKey="Median CO₂ (t)"
            height={300}
            barColor="#6B9D78"
            unit="tonnes"
          />
        </div>

        <div className="editorial-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-brand-navy mb-2">
              The Structural Climate Paradox
            </h3>
            <p className="text-xs text-brand-textMuted mb-4">
              Key empirical takeaways from the economic–environmental analysis:
            </p>

            <div className="space-y-3 text-xs leading-relaxed text-brand-text">
              <div className="p-3 rounded bg-brand-lightBg border border-brand-border">
                <span className="font-semibold text-brand-navy block">
                  The 27× Energy Consumption Leap
                </span>
                <p className="text-brand-textMuted mt-1">
                  Poorest nations (Q1) emit a median of 0.26 tonnes per person, while wealthiest
                  states (Q4) emit 7.10 tonnes per person. Economic ascendancy drives heavy carbonization.
                </p>
              </div>

              <div className="p-3 rounded bg-brand-lightBg border border-brand-border">
                <span className="font-semibold text-brand-navy block">
                  The Emissions–Longevity Association (r = 0.75)
                </span>
                <p className="text-brand-textMuted mt-1">
                  Because both life expectancy and CO₂ emissions increase with GDP, they correlate
                  strongly with each other. This is an indirect association driven by industrialization,
                  not evidence that carbon makes citizens healthier.
                </p>
              </div>

              <div className="p-3 rounded bg-brand-lightBg border border-brand-border">
                <span className="font-semibold text-brand-navy block">
                  Distinguishing CO₂ from Local Air Pollution
                </span>
                <p className="text-brand-textMuted mt-1">
                  CO₂ is a global greenhouse gas. Local air quality (PM2.5 particulate matter)
                  often improves in very wealthy nations via environmental regulation, even as total
                  CO₂ remains elevated.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-brand-border text-xs text-brand-deepTeal">
            <Link href="/outliers" className="font-semibold hover:underline flex items-center space-x-1">
              <span>Inspect high-CO₂ outlier countries passing the 12.5t IQR fence →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
