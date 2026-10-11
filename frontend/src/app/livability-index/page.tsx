"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sliders,
  RotateCcw,
  Award,
  TrendingUp,
  TrendingDown,
  Search,
  Sparkles,
  Download,
  Info,
  ShieldAlert,
  ArrowUpDown,
} from "lucide-react";
import DimensionBadge from "@/components/DimensionBadge";
import StatCard from "@/components/StatCard";
import ExportButton from "@/components/ExportButton";
import {
  recalculateLivabilityIndex,
  DimensionWeights,
} from "@/lib/indexCalculator";

const DEFAULT_WEIGHTS: DimensionWeights = {
  health: 25,
  social: 25,
  economic: 25,
  environmental: 25,
};

const PRESETS = [
  {
    name: "Equal Weights (Baseline)",
    weights: { health: 25, social: 25, economic: 25, environmental: 25 },
    description: "Standard balanced research formulation (25% each).",
  },
  {
    name: "Health & Survival Priority",
    weights: { health: 50, social: 20, economic: 15, environmental: 15 },
    description: "Heavy emphasis on life expectancy, child survival, and doctors.",
  },
  {
    name: "Green & Sustainability Focus",
    weights: { health: 25, social: 15, economic: 15, environmental: 45 },
    description: "Rewards low carbon intensity and extensive forest cover.",
  },
  {
    name: "Economic Output & Growth",
    weights: { health: 20, social: 15, economic: 50, environmental: 15 },
    description: "Prioritizes per capita GDP and low unemployment.",
  },
];

export default function LivabilityIndexPage() {
  const [indexDataset, setIndexDataset] = useState<any[]>([]);
  const [weights, setWeights] = useState<DimensionWeights>(DEFAULT_WEIGHTS);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/index_rankings.json")
      .then((r) => r.json())
      .then((data) => {
        setIndexDataset(data.countries);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // Live recalculated rankings
  const { recalculatedCountries, spearmanCorr, topClimbers, topFallers } =
    useMemo(() => {
      if (indexDataset.length === 0) {
        return {
          recalculatedCountries: [],
          spearmanCorr: 0.81,
          topClimbers: [],
          topFallers: [],
        };
      }
      return recalculateLivabilityIndex(indexDataset, weights);
    }, [indexDataset, weights]);

  // Filtered search list
  const filteredList = useMemo(() => {
    if (!search) return recalculatedCountries;
    return recalculatedCountries.filter((c) =>
      c.Country.toLowerCase().includes(search.toLowerCase())
    );
  }, [recalculatedCountries, search]);

  const handleSliderChange = (dim: keyof DimensionWeights, value: number) => {
    setWeights((prev) => ({
      ...prev,
      [dim]: value,
    }));
  };

  const applyPreset = (presetWeights: DimensionWeights) => {
    setWeights(presetWeights);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-brand-navy">Loading Livability Index Studio...</p>
      </div>
    );
  }

  // Weight percentages for display
  const totalW = weights.health + weights.social + weights.economic + weights.environmental;
  const safeTotal = totalW > 0 ? totalW : 1;
  const pctHealth = Math.round((weights.health / safeTotal) * 100);
  const pctSocial = Math.round((weights.social / safeTotal) * 100);
  const pctEconomic = Math.round((weights.economic / safeTotal) * 100);
  const pctEnv = 100 - (pctHealth + pctSocial + pctEconomic);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-border">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-deepTeal">
              Interactive Policy Simulation Engine
            </span>
            <span className="text-xs text-brand-textMuted">• 131 Complete Country Records</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mt-1">
            Exploratory Livability Index
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted mt-1">
            Adjust dimension weights in real time to see how national rankings reorder compared to simple GDP per capita.
          </p>
        </div>

        <ExportButton
          data={recalculatedCountries.map((c) => ({
            Country: c.Country,
            Custom_Livability_Index: c.custom_index,
            Custom_Rank: c.custom_rank,
            GDP_per_capita: c.GDPpc,
            GDP_Rank: c.GDPrank,
            Rank_Shift: c.rank_shift,
            Health_Score: c.health_score,
            Social_Score: c.social_score,
            Economic_Score: c.economic_score,
            Environmental_Score: c.environmental_score,
            Health_Weight: `${pctHealth}%`,
            Social_Weight: `${pctSocial}%`,
            Economic_Weight: `${pctEconomic}%`,
            Environmental_Weight: `${pctEnv}%`,
          }))}
          filename="beyond_gdp_custom_index_rankings"
          label="Export Custom Rankings CSV"
        />
      </div>

      {/* Preset Buttons & Weight Sliders */}
      <div className="editorial-card p-6 sm:p-8 bg-white space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-border gap-3">
          <div>
            <h2 className="font-serif text-xl font-bold text-brand-navy">
              Dimension Weight Configuration
            </h2>
            <p className="text-xs text-brand-textMuted">
              Current Weights: Health {pctHealth}% | Social {pctSocial}% | Economic {pctEconomic}% | Environmental {pctEnv}%
            </p>
          </div>

          <button
            onClick={() => setWeights(DEFAULT_WEIGHTS)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-brand-textMuted hover:text-brand-navy border border-brand-border bg-brand-lightBg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Equal Weights (25%)</span>
          </button>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.weights)}
              className="p-3 text-left rounded-lg border border-brand-border bg-brand-lightBg/50 hover:bg-brand-lightBg hover:border-brand-teal transition text-xs flex flex-col justify-between"
            >
              <div>
                <span className="font-serif font-bold text-brand-navy block mb-0.5">
                  {preset.name}
                </span>
                <span className="text-[11px] text-brand-textMuted leading-tight block">
                  {preset.description}
                </span>
              </div>
              <span className="mt-2 text-[10px] text-brand-teal font-semibold">
                Apply Preset →
              </span>
            </button>
          ))}
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* Health Slider */}
          <div className="p-4 rounded-lg bg-brand-lightBg/40 border border-brand-border">
            <div className="flex items-center justify-between mb-2">
              <DimensionBadge dimension="Health" size="sm" />
              <span className="font-mono font-bold text-xs text-[#159A91]">
                {pctHealth}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights.health}
              onChange={(e) => handleSliderChange("health", Number(e.target.value))}
              className="w-full accent-[#159A91]"
            />
            <p className="text-[10px] text-brand-textMuted mt-2">
              Life Exp, Infant Mort, Doctors
            </p>
          </div>

          {/* Social Slider */}
          <div className="p-4 rounded-lg bg-brand-lightBg/40 border border-brand-border">
            <div className="flex items-center justify-between mb-2">
              <DimensionBadge dimension="Social" size="sm" />
              <span className="font-mono font-bold text-xs text-[#D9A441]">
                {pctSocial}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights.social}
              onChange={(e) => handleSliderChange("social", Number(e.target.value))}
              className="w-full accent-[#D9A441]"
            />
            <p className="text-[10px] text-brand-textMuted mt-2">
              Tertiary Enrolment Gross %
            </p>
          </div>

          {/* Economic Slider */}
          <div className="p-4 rounded-lg bg-brand-lightBg/40 border border-brand-border">
            <div className="flex items-center justify-between mb-2">
              <DimensionBadge dimension="Economic" size="sm" />
              <span className="font-mono font-bold text-xs text-[#4777A8]">
                {pctEconomic}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights.economic}
              onChange={(e) => handleSliderChange("economic", Number(e.target.value))}
              className="w-full accent-[#4777A8]"
            />
            <p className="text-[10px] text-brand-textMuted mt-2">
              GDP per capita, Low Unemployment
            </p>
          </div>

          {/* Environmental Slider */}
          <div className="p-4 rounded-lg bg-brand-lightBg/40 border border-brand-border">
            <div className="flex items-center justify-between mb-2">
              <DimensionBadge dimension="Environmental" size="sm" />
              <span className="font-mono font-bold text-xs text-[#6B9D78]">
                {pctEnv}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights.environmental}
              onChange={(e) => handleSliderChange("environmental", Number(e.target.value))}
              className="w-full accent-[#6B9D78]"
            />
            <p className="text-[10px] text-brand-textMuted mt-2">
              Low CO₂ per capita, Forest Cover
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Rank Correlation with GDP"
          value={`ρ = ${spearmanCorr.toFixed(2)}`}
          subtext="Spearman rank correlation vs GDP rank"
          badge="Correlation"
          dimensionColor="#159A91"
        />
        <StatCard
          title="#1 Country Overall"
          value={recalculatedCountries[0]?.Country || "—"}
          subtext={`Score: ${recalculatedCountries[0]?.custom_index.toFixed(1)} / 100`}
          badge="Current Leader"
          dimensionColor="#D9A441"
          icon={Award}
        />
        <StatCard
          title="Biggest Climber"
          value={`${topClimbers[0]?.Country || "—"} (+${topClimbers[0]?.rank_shift})`}
          subtext={`GDP #${topClimbers[0]?.GDPrank} → Index #${topClimbers[0]?.custom_rank}`}
          badge="Climber"
          dimensionColor="#102A36"
          icon={TrendingUp}
        />
        <StatCard
          title="Biggest Faller"
          value={`${topFallers[0]?.Country || "—"} (${topFallers[0]?.rank_shift})`}
          subtext={`GDP #${topFallers[0]?.GDPrank} → Index #${topFallers[0]?.custom_rank}`}
          badge="Faller"
          dimensionColor="#E47D62"
          icon={TrendingDown}
        />
      </div>

      {/* Climbers & Fallers Preview Boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Climbers */}
        <div className="editorial-card p-5">
          <div className="flex items-center space-x-2 text-emerald-700 mb-3 pb-2 border-b border-brand-border">
            <TrendingUp className="w-4 h-4" />
            <h3 className="font-serif text-base font-bold text-brand-navy">
              Top 5 Rank Climbers (Outperforming GDP Rank)
            </h3>
          </div>
          <div className="divide-y divide-brand-border/60 text-xs">
            {topClimbers.slice(0, 5).map((c) => (
              <div key={c.Country} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-brand-navy">{c.Country}</span>
                  <span className="text-[11px] text-gray-500 font-mono ml-2">
                    ${Math.round(c.GDPpc).toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-600">
                    +{c.rank_shift} Places
                  </span>
                  <p className="text-[10px] text-gray-400">
                    GDP #{c.GDPrank} → Index #{c.custom_rank}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Fallers */}
        <div className="editorial-card p-5">
          <div className="flex items-center space-x-2 text-rose-700 mb-3 pb-2 border-b border-brand-border">
            <TrendingDown className="w-4 h-4" />
            <h3 className="font-serif text-base font-bold text-brand-navy">
              Top 5 Rank Fallers (Penalized on Livability)
            </h3>
          </div>
          <div className="divide-y divide-brand-border/60 text-xs">
            {topFallers.slice(0, 5).map((c) => (
              <div key={c.Country} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-brand-navy">{c.Country}</span>
                  <span className="text-[11px] text-gray-500 font-mono ml-2">
                    ${Math.round(c.GDPpc).toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-rose-600">
                    {c.rank_shift} Places
                  </span>
                  <p className="text-[10px] text-gray-400">
                    GDP #{c.GDPrank} → Index #{c.custom_rank}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recalculated Rankings Table */}
      <div className="editorial-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-brand-border gap-3">
          <div>
            <h2 className="font-serif text-xl font-bold text-brand-navy">
              Complete Recalculated Country Rankings (131 Countries)
            </h2>
            <p className="text-xs text-brand-textMuted">
              Sorted by Custom Composite Index. Hover or click country name for profile.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search ranked country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-md border border-brand-border bg-brand-lightBg focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-teal text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-brand-textMuted font-semibold">
                <th className="py-2.5 pr-3 text-center">Rank</th>
                <th className="py-2.5 px-3">Country</th>
                <th className="py-2.5 px-3 text-right">Custom Index</th>
                <th className="py-2.5 px-3 text-right">GDP Rank Shift</th>
                <th className="py-2.5 px-3 text-right">GDP pc (US$)</th>
                <th className="py-2.5 px-2 text-right">Health</th>
                <th className="py-2.5 px-2 text-right">Social</th>
                <th className="py-2.5 px-2 text-right">Economic</th>
                <th className="py-2.5 px-2 text-right">Env</th>
                <th className="py-2.5 pl-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 font-mono">
              {filteredList.slice(0, 50).map((c) => (
                <tr key={c.Country} className="hover:bg-brand-lightBg/50 transition">
                  <td className="py-2.5 pr-3 text-center font-bold text-brand-navy">
                    #{c.custom_rank}
                  </td>
                  <td className="py-2.5 px-3 font-sans font-medium text-brand-navy">
                    <Link
                      href={`/countries/${encodeURIComponent(c.Country)}`}
                      className="hover:text-brand-teal"
                    >
                      {c.Country}
                    </Link>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-brand-deepTeal text-sm">
                    {c.custom_index.toFixed(1)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`font-semibold ${
                        c.rank_shift > 0
                          ? "text-emerald-600"
                          : c.rank_shift < 0
                          ? "text-rose-600"
                          : "text-gray-500"
                      }`}
                    >
                      {c.rank_shift > 0 ? "+" : ""}
                      {c.rank_shift}
                    </span>
                    <span className="text-[10px] text-gray-400 font-sans ml-1">
                      (GDP #{c.GDPrank})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-gray-700">
                    ${Math.round(c.GDPpc).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-2 text-right text-[#159A91]">
                    {c.health_score.toFixed(0)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-[#D9A441]">
                    {c.social_score.toFixed(0)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-[#4777A8]">
                    {c.economic_score.toFixed(0)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-[#6B9D78]">
                    {c.environmental_score.toFixed(0)}
                  </td>
                  <td className="py-2.5 pl-3 text-right font-sans">
                    <Link
                      href={`/countries/${encodeURIComponent(c.Country)}`}
                      className="text-brand-deepTeal font-medium hover:underline text-xs"
                    >
                      Profile →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredList.length > 50 && (
            <div className="pt-3 text-center text-xs text-brand-textMuted border-t border-brand-border">
              Displaying first 50 countries. Export full CSV for all 131 recalculated country records.
            </div>
          )}
        </div>
      </div>

      {/* Disclaimers & Methodology Alert */}
      <div className="p-4 rounded-xl bg-brand-lightBg border border-brand-border text-xs text-brand-textMuted flex items-start space-x-3">
        <Info className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
        <p className="leading-relaxed">
          <strong className="text-brand-navy">Academic Exploratory Disclaimer:</strong>{" "}
          This livability index was developed as an exploratory data analysis pedagogical tool for
          course BACSE301 (CSE Data Science). It illustrates how multidimensional weighting creates
          divergence from GDP. It is not an official geopolitical or multilateral index like the UN HDI.
        </p>
      </div>
    </div>
  );
}
