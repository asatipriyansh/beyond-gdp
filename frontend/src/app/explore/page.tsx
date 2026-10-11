"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  RotateCcw,
  BarChart2,
  List,
  ScatterChart as ScatterIcon,
  HelpCircle,
  Download,
  AlertTriangle,
} from "lucide-react";
import DimensionBadge from "@/components/DimensionBadge";
import StatCard from "@/components/StatCard";
import ExportButton from "@/components/ExportButton";
import ScatterPlot from "@/components/Charts/ScatterPlot";
import BarChartBox from "@/components/Charts/BarChartBox";
import CorrelationHeatmap from "@/components/Charts/CorrelationHeatmap";

export default function ExplorePage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [correlations, setCorrelations] = useState<any>(null);
  const [missingMeta, setMissingMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuartile, setSelectedQuartile] = useState("all");
  const [minLifeExp, setMinLifeExp] = useState(50);
  const [maxLifeExp, setMaxLifeExp] = useState(85);
  const [activeTab, setActiveTab] = useState<"overview" | "distributions" | "scatter" | "missing" | "ranking">("overview");

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, sRes, corrRes, metaRes] = await Promise.all([
          fetch("/data/countries.json").then((r) => r.json()),
          fetch("/data/summary_stats.json").then((r) => r.json()),
          fetch("/data/correlations.json").then((r) => r.json()),
          fetch("/data/raw_metadata.json").then((r) => r.json()),
        ]);
        setCountries(cRes);
        setStats(sRes);
        setCorrelations(corrRes);
        setMissingMeta(metaRes);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered countries (only from clean dataset)
  const filteredCountries = useMemo(() => {
    return countries.filter((c) => {
      if (!c.in_clean_dataset || !c.clean) return false;

      // Search
      if (
        searchTerm &&
        !c.country.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Quartile
      if (
        selectedQuartile !== "all" &&
        c.clean.income_quartile !== selectedQuartile
      ) {
        return false;
      }

      // Life Expectancy range
      if (c.clean.life_exp < minLifeExp || c.clean.life_exp > maxLifeExp) {
        return false;
      }

      return true;
    });
  }, [countries, searchTerm, selectedQuartile, minLifeExp, maxLifeExp]);

  // Derived filtered metrics
  const filteredMetrics = useMemo(() => {
    if (filteredCountries.length === 0) {
      return {
        count: 0,
        medianGdp: 0,
        medianLifeExp: 0,
        medianCo2: 0,
        medianInfMort: 0,
        medianUnemp: 0,
      };
    }

    const gdps = filteredCountries.map((c) => c.clean.gdp_pc).sort((a, b) => a - b);
    const lifeExps = filteredCountries.map((c) => c.clean.life_exp).sort((a, b) => a - b);
    const co2s = filteredCountries
      .map((c) => c.clean.co2_pc)
      .filter((v) => v !== null)
      .sort((a, b) => a - b);
    const infMorts = filteredCountries
      .map((c) => c.clean.inf_mort)
      .filter((v) => v !== null)
      .sort((a, b) => a - b);
    const unemps = filteredCountries
      .map((c) => c.clean.unemployment)
      .filter((v) => v !== null)
      .sort((a, b) => a - b);

    const getMedian = (arr: number[]) => {
      if (!arr.length) return 0;
      const mid = Math.floor(arr.length / 2);
      return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
    };

    return {
      count: filteredCountries.length,
      medianGdp: Math.round(getMedian(gdps)),
      medianLifeExp: Math.round(getMedian(lifeExps) * 10) / 10,
      medianCo2: Math.round(getMedian(co2s) * 100) / 100,
      medianInfMort: Math.round(getMedian(infMorts) * 10) / 10,
      medianUnemp: Math.round(getMedian(unemps) * 10) / 10,
    };
  }, [filteredCountries]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedQuartile("all");
    setMinLifeExp(50);
    setMaxLifeExp(85);
  };

  // Missing data breakdown chart
  const missingChartData = useMemo(() => {
    if (!missingMeta || !missingMeta.missing_counts) return [];
    return Object.entries(missingMeta.missing_counts)
      .filter(([k]) => k !== "Country")
      .map(([k, count]) => ({
        name: k,
        missing: count,
      }))
      .sort((a, b) => (b.missing as number) - (a.missing as number));
  }, [missingMeta]);

  // Life expectancy distribution bins
  const lifeExpBins = useMemo(() => {
    const bins = [
      { name: "50-59 yrs", count: 0 },
      { name: "60-69 yrs", count: 0 },
      { name: "70-74 yrs", count: 0 },
      { name: "75-79 yrs", count: 0 },
      { name: "80+ yrs", count: 0 },
    ];
    filteredCountries.forEach((c) => {
      const le = c.clean.life_exp;
      if (le < 60) bins[0].count++;
      else if (le < 70) bins[1].count++;
      else if (le < 75) bins[2].count++;
      else if (le < 80) bins[3].count++;
      else bins[4].count++;
    });
    return bins;
  }, [filteredCountries]);

  // Top 15 GDP ranking in filtered set
  const rankingChartData = useMemo(() => {
    return [...filteredCountries]
      .sort((a, b) => b.clean.gdp_pc - a.clean.gdp_pc)
      .slice(0, 15)
      .map((c) => ({
        name: c.country,
        value: Math.round(c.clean.gdp_pc),
      }));
  }, [filteredCountries]);

  // Scatter data
  const scatterPoints = useMemo(() => {
    return filteredCountries.map((c) => ({
      country: c.country,
      x: c.clean.gdp_pc,
      y: c.clean.life_exp,
    }));
  }, [filteredCountries]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-brand-navy">Loading EDA dataset and statistics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-border">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-deepTeal">
              Interactive Dashboard
            </span>
            <span className="text-xs text-brand-textMuted">• 141 Cleaned Countries</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mt-1">
            Exploratory Data Analysis Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted mt-1">
            Query indicator distributions, filter by development tiers, inspect missingness, and download slice outputs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <ExportButton
            data={filteredCountries.map((c) => ({
              Country: c.country,
              GDP_per_capita: c.clean.gdp_pc,
              Life_Expectancy: c.clean.life_exp,
              CO2_per_capita: c.clean.co2_pc,
              Infant_Mortality: c.clean.inf_mort,
              Physicians_per_1k: c.clean.physicians,
              Unemployment_pct: c.clean.unemployment,
              Tertiary_enrolment_pct: c.clean.tertiary,
              Forest_pct: c.clean.forest,
              Income_Quartile: c.clean.income_quartile,
            }))}
            filename={`beyond_gdp_filtered_${filteredCountries.length}`}
            label={`Export Filtered CSV (${filteredCountries.length})`}
          />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="editorial-card p-5 bg-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-navy">
            <Filter className="w-4 h-4 text-brand-teal" />
            <span>Active Controls & Slicers</span>
          </div>
          <button
            onClick={resetFilters}
            className="inline-flex items-center space-x-1 text-xs text-brand-textMuted hover:text-brand-coral transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Search */}
          <div>
            <label className="block text-brand-textMuted font-medium mb-1.5">
              Country Search
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by country name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-md border border-brand-border bg-brand-lightBg focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-teal text-xs"
              />
            </div>
          </div>

          {/* Quartile Filter */}
          <div>
            <label className="block text-brand-textMuted font-medium mb-1.5">
              Income Quartile
            </label>
            <select
              value={selectedQuartile}
              onChange={(e) => setSelectedQuartile(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-brand-border bg-brand-lightBg focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-teal text-xs"
            >
              <option value="all">All Income Quartiles</option>
              <option value="Q1 (Poorest)">Q1 (Poorest: &lt;$1,865)</option>
              <option value="Q2 (Lower-Middle)">Q2 (Lower-Middle: $1,865–$6,076)</option>
              <option value="Q3 (Upper-Middle)">Q3 (Upper-Middle: $6,076–$21,080)</option>
              <option value="Q4 (Richest)">Q4 (Richest: &gt;$21,080)</option>
            </select>
          </div>

          {/* Min Life Expectancy */}
          <div>
            <div className="flex justify-between text-brand-textMuted font-medium mb-1.5">
              <span>Min Life Expectancy</span>
              <span className="font-mono text-brand-navy">{minLifeExp} yrs</span>
            </div>
            <input
              type="range"
              min={50}
              max={80}
              step={1}
              value={minLifeExp}
              onChange={(e) => setMinLifeExp(Number(e.target.value))}
              className="w-full accent-brand-teal"
            />
          </div>

          {/* Max Life Expectancy */}
          <div>
            <div className="flex justify-between text-brand-textMuted font-medium mb-1.5">
              <span>Max Life Expectancy</span>
              <span className="font-mono text-brand-navy">{maxLifeExp} yrs</span>
            </div>
            <input
              type="range"
              min={60}
              max={85}
              step={1}
              value={maxLifeExp}
              onChange={(e) => setMaxLifeExp(Number(e.target.value))}
              className="w-full accent-brand-teal"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Summary Cards for Filtered Slice */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Matching Nations"
          value={filteredMetrics.count}
          subtext={`of 141 clean countries`}
        />
        <StatCard
          title="Median GDPpc"
          value={`$${filteredMetrics.medianGdp.toLocaleString()}`}
          subtext="Economic dimension"
          dimensionColor="#4777A8"
        />
        <StatCard
          title="Median Life Exp"
          value={`${filteredMetrics.medianLifeExp} yrs`}
          subtext="Health dimension"
          dimensionColor="#159A91"
        />
        <StatCard
          title="Median CO₂pc"
          value={`${filteredMetrics.medianCo2} t`}
          subtext="Environmental dimension"
          dimensionColor="#6B9D78"
        />
        <StatCard
          title="Median Inf Mort"
          value={`${filteredMetrics.medianInfMort} /1k`}
          subtext="Child survival"
          dimensionColor="#E47D62"
        />
        <StatCard
          title="Median Unemp"
          value={`${filteredMetrics.medianUnemp}%`}
          subtext="Labor gap"
          dimensionColor="#D9A441"
        />
      </div>

      {/* View Switcher Tabs */}
      <div className="flex border-b border-brand-border space-x-4 text-xs font-medium">
        {[
          { id: "overview", label: "EDA Summary & Distributions" },
          { id: "scatter", label: "Interactive Scatter Plot" },
          { id: "ranking", label: "Top 15 GDP Ranking" },
          { id: "missing", label: "Missing Data Audit" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 px-1 border-b-2 transition ${
              activeTab === t.id
                ? "border-brand-teal text-brand-navy font-bold"
                : "border-transparent text-brand-textMuted hover:text-brand-navy"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Distributions */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Life Expectancy Bins */}
          <div className="editorial-card p-5 lg:col-span-1">
            <h3 className="font-serif text-lg font-bold text-brand-navy mb-1">
              Life Expectancy Distribution
            </h3>
            <p className="text-xs text-brand-textMuted mb-4">
              Counts in filtered sample ({filteredCountries.length} countries).
            </p>
            <BarChartBox
              data={lifeExpBins}
              dataKey="count"
              height={260}
              barColor="#159A91"
              unit="countries"
            />
          </div>

          {/* Descriptive Statistics Table */}
          <div className="editorial-card p-5 lg:col-span-2 overflow-x-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-navy">
                  Baseline Dataset Descriptive Statistics
                </h3>
                <p className="text-xs text-brand-textMuted">
                  Calculated across the 141 validated clean countries.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-lightBg text-brand-navy border border-brand-border">
                n = 141
              </span>
            </div>

            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border text-brand-textMuted font-semibold">
                  <th className="py-2 pr-3">Indicator</th>
                  <th className="py-2 px-2 text-right">Mean</th>
                  <th className="py-2 px-2 text-right">Median</th>
                  <th className="py-2 px-2 text-right">Std</th>
                  <th className="py-2 px-2 text-right">Min</th>
                  <th className="py-2 px-2 text-right">Max</th>
                  <th className="py-2 pl-2 text-right">Skewness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60 font-mono">
                {Object.entries(stats).map(([k, s]: any) => (
                  <tr key={k} className="hover:bg-brand-lightBg/50">
                    <td className="py-2 pr-3 font-sans font-medium text-brand-navy">
                      {k === "GDPpc"
                        ? "GDP per capita ($)"
                        : k === "LifeExp"
                        ? "Life expectancy (yrs)"
                        : k === "CO2pc"
                        ? "CO₂ per capita (t)"
                        : k === "InfMort"
                        ? "Infant mort. (/1k)"
                        : k === "Phys"
                        ? "Physicians (/1k)"
                        : k === "Unemp"
                        ? "Unemployment (%)"
                        : k === "Tertiary"
                        ? "Tertiary enrol. (%)"
                        : k === "Forest"
                        ? "Forest area (%)"
                        : k}
                    </td>
                    <td className="py-2 px-2 text-right">{s.mean.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-bold text-brand-teal">
                      {s.median.toLocaleString()}
                    </td>
                    <td className="py-2 px-2 text-right text-gray-500">
                      {s.std.toLocaleString()}
                    </td>
                    <td className="py-2 px-2 text-right">{s.min.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right">{s.max.toLocaleString()}</td>
                    <td className="py-2 pl-2 text-right font-bold text-brand-navy">
                      {s.skew.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Scatter */}
      {activeTab === "scatter" && (
        <div className="editorial-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-brand-border">
            <div>
              <h3 className="font-serif text-xl font-bold text-brand-navy">
                Wealth vs. Health in Current Selection
              </h3>
              <p className="text-xs text-brand-textMuted">
                Displaying {filteredCountries.length} countries. Click or hover on dots for values.
              </p>
            </div>
            <div className="text-xs text-brand-textMuted mt-2 sm:mt-0">
              Logarithmic X axis (GDP per capita)
            </div>
          </div>

          <ScatterPlot
            data={scatterPoints}
            xAxisLabel="GDP per capita (US$, log scale)"
            yAxisLabel="Life Expectancy (years)"
            xScale="log"
            height={440}
            yUnit="years"
          />
        </div>
      )}

      {/* Tab 3: Ranking */}
      {activeTab === "ranking" && (
        <div className="editorial-card p-6">
          <div className="mb-4 pb-3 border-b border-brand-border">
            <h3 className="font-serif text-xl font-bold text-brand-navy">
              Top 15 Countries by GDP per Capita
            </h3>
            <p className="text-xs text-brand-textMuted">
              Filtered subset rankings (US$ per capita).
            </p>
          </div>
          <BarChartBox
            data={rankingChartData}
            dataKey="value"
            layout="vertical"
            height={480}
            barColor="#4777A8"
            unit="$"
          />
        </div>
      )}

      {/* Tab 4: Missing Data Audit */}
      {activeTab === "missing" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="editorial-card p-5">
            <h3 className="font-serif text-lg font-bold text-brand-navy mb-1">
              Missing Values by Indicator (Raw 146 Dataset)
            </h3>
            <p className="text-xs text-brand-textMuted mb-4">
              Number of null records across columns in original snapshot.
            </p>
            <BarChartBox
              data={missingChartData}
              dataKey="missing"
              layout="vertical"
              height={320}
              barColor="#0D7377"
              unit="countries"
            />
          </div>

          <div className="editorial-card p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-brand-navy mb-2">
                Handling Rules & Exclusions
              </h3>
              <div className="space-y-3 text-xs text-brand-text leading-relaxed">
                <div className="p-3 rounded bg-brand-lightBg border border-brand-border">
                  <p className="font-semibold text-brand-navy">Unemployment (14 gaps)</p>
                  <p className="text-brand-textMuted mt-1">
                    Most frequent missing indicator. Kept as null for univariate analysis rather than
                    corrupting distributions with synthetic imputation.
                  </p>
                </div>
                <div className="p-3 rounded bg-brand-lightBg border border-brand-border">
                  <p className="font-semibold text-brand-navy">5 Countries Dropped from Clean Set</p>
                  <p className="text-brand-textMuted mt-1">
                    Andorra, Monaco, Nauru, North Macedonia, and Eswatini lacked Life Expectancy or GDP and were excluded from bivariate regression.
                  </p>
                </div>
                <div className="p-3 rounded bg-brand-lightBg border border-brand-border">
                  <p className="font-semibold text-brand-navy">Complete Index Subset (131 countries)</p>
                  <p className="text-brand-textMuted mt-1">
                    Composite index requires all 7 indicators present, yielding 131 strictly comparable nations.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-brand-border text-xs text-brand-deepTeal flex items-center space-x-1">
              <Link href="/methodology" className="font-semibold hover:underline">
                Read full data cleaning documentation →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filtered Countries Table */}
      <div className="editorial-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-brand-border">
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-navy">
              Filtered Country Records ({filteredCountries.length})
            </h3>
            <p className="text-xs text-brand-textMuted">
              Direct access to indicator values and profile pages.
            </p>
          </div>
          <span className="text-xs text-brand-textMuted mt-2 sm:mt-0 font-mono">
            Showing {filteredCountries.length} of 141 clean countries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-brand-textMuted font-semibold">
                <th className="py-2 pr-3">Country</th>
                <th className="py-2 px-2 text-right">GDP pc (US$)</th>
                <th className="py-2 px-2 text-right">Life Exp</th>
                <th className="py-2 px-2 text-right">Inf Mort (/1k)</th>
                <th className="py-2 px-2 text-right">CO₂ pc (t)</th>
                <th className="py-2 px-2 text-right">Physicians</th>
                <th className="py-2 px-2 text-right">Unemp (%)</th>
                <th className="py-2 px-2 text-right">Quartile</th>
                <th className="py-2 pl-3 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {filteredCountries.slice(0, 30).map((c) => (
                <tr key={c.country} className="hover:bg-brand-lightBg/50">
                  <td className="py-2.5 pr-3 font-medium text-brand-navy">
                    {c.country}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono">
                    ${Math.round(c.clean.gdp_pc).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono font-semibold text-brand-teal">
                    {c.clean.life_exp.toFixed(1)} yrs
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-gray-600">
                    {c.clean.inf_mort !== null ? c.clean.inf_mort.toFixed(1) : "—"}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono">
                    {c.clean.co2_pc !== null ? c.clean.co2_pc.toFixed(2) : "—"}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono">
                    {c.clean.physicians !== null ? c.clean.physicians.toFixed(2) : "—"}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono">
                    {c.clean.unemployment !== null ? `${c.clean.unemployment.toFixed(1)}%` : "—"}
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-lightBg text-brand-navy border border-brand-border">
                      {c.clean.income_quartile.split(" ")[0]}
                    </span>
                  </td>
                  <td className="py-2.5 pl-3 text-right">
                    <Link
                      href={`/countries/${encodeURIComponent(c.country)}`}
                      className="text-brand-deepTeal font-medium hover:underline text-xs"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCountries.length > 30 && (
            <div className="pt-3 text-center text-xs text-brand-textMuted border-t border-brand-border">
              Displaying first 30 countries of {filteredCountries.length}. Use search or see all in the Country Directory.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
