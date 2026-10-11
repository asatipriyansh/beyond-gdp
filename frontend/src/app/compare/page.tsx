"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Scale,
  Plus,
  Trash2,
  Download,
  AlertCircle,
  ExternalLink,
  Info,
} from "lucide-react";
import DimensionBadge from "@/components/DimensionBadge";
import ExportButton from "@/components/ExportButton";
import RadarComparison from "@/components/Charts/RadarComparison";
import BarChartBox from "@/components/Charts/BarChartBox";

const COUNTRY_COLORS = ["#159A91", "#4777A8", "#E47D62", "#D9A441", "#6B9D78"];

export default function ComparePage() {
  const [allCountries, setAllCountries] = useState<any[]>([]);
  const [selectedCountryNames, setSelectedCountryNames] = useState<string[]>([
    "Finland",
    "Qatar",
    "Equatorial Guinea",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/countries.json")
      .then((r) => r.json())
      .then((data) => {
        setAllCountries(data.filter((c: any) => c.in_clean_dataset && c.clean));
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const selectedCountries = useMemo(() => {
    return selectedCountryNames
      .map((name) => allCountries.find((c) => c.country === name))
      .filter(Boolean);
  }, [allCountries, selectedCountryNames]);

  const addCountry = (name: string) => {
    if (selectedCountryNames.length < 5 && !selectedCountryNames.includes(name)) {
      setSelectedCountryNames([...selectedCountryNames, name]);
      setSearchQuery("");
    }
  };

  const removeCountry = (name: string) => {
    if (selectedCountryNames.length > 2) {
      setSelectedCountryNames(selectedCountryNames.filter((c) => c !== name));
    }
  };

  // Available countries for search
  const availableCountries = useMemo(() => {
    if (!searchQuery) return [];
    return allCountries
      .filter(
        (c) =>
          !selectedCountryNames.includes(c.country) &&
          c.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 8);
  }, [allCountries, selectedCountryNames, searchQuery]);

  // Radar Data (Health, Social, Economic, Environmental scores)
  const radarData = useMemo(() => {
    if (selectedCountries.length === 0) return [];
    const dims = [
      { key: "health_score", name: "Health" },
      { key: "social_score", name: "Social (Edu)" },
      { key: "economic_score", name: "Economic" },
      { key: "environmental_score", name: "Environmental" },
    ];

    return dims.map((d) => {
      const row: any = { dimension: d.name };
      selectedCountries.forEach((c) => {
        if (c.index) {
          row[c.country] = c.index[d.key];
        } else {
          // If country not in 131 index set, default to 50 or estimate
          row[c.country] = 50;
        }
      });
      return row;
    });
  }, [selectedCountries]);

  // Grouped Bar Data for Life Exp & CO2
  const groupedBarsLifeExp = useMemo(() => {
    return selectedCountries.map((c) => ({
      name: c.country,
      "Life Expectancy (yrs)": c.clean.life_exp,
    }));
  }, [selectedCountries]);

  const groupedBarsCo2 = useMemo(() => {
    return selectedCountries.map((c) => ({
      name: c.country,
      "CO₂ per capita (t)": c.clean.co2_pc || 0,
    }));
  }, [selectedCountries]);

  // Deterministic Insights
  const comparisonInsights = useMemo(() => {
    if (selectedCountries.length < 2) return [];
    const insights: string[] = [];

    // Wealthiest vs Poorest
    const sortedGdp = [...selectedCountries].sort(
      (a, b) => b.clean.gdp_pc - a.clean.gdp_pc
    );
    const richest = sortedGdp[0];
    const poorest = sortedGdp[sortedGdp.length - 1];
    const gdpRatio = (richest.clean.gdp_pc / poorest.clean.gdp_pc).toFixed(1);
    insights.push(
      `${richest.country} has ${gdpRatio}× the GDP per capita of ${poorest.country} ($${Math.round(
        richest.clean.gdp_pc
      ).toLocaleString()} vs $${Math.round(poorest.clean.gdp_pc).toLocaleString()}).`
    );

    // Life expectancy difference
    const sortedLe = [...selectedCountries].sort(
      (a, b) => b.clean.life_exp - a.clean.life_exp
    );
    const highestLe = sortedLe[0];
    const lowestLe = sortedLe[sortedLe.length - 1];
    const leDiff = (highestLe.clean.life_exp - lowestLe.clean.life_exp).toFixed(1);
    insights.push(
      `A life expectancy gap of ${leDiff} years separates ${highestLe.country} (${highestLe.clean.life_exp.toFixed(
        1
      )} yrs) and ${lowestLe.country} (${lowestLe.clean.life_exp.toFixed(1)} yrs).`
    );

    // CO2 contrast
    const validCo2 = selectedCountries.filter((c) => c.clean.co2_pc !== null);
    if (validCo2.length >= 2) {
      const sortedCo2 = [...validCo2].sort(
        (a, b) => b.clean.co2_pc - a.clean.co2_pc
      );
      const emitter = sortedCo2[0];
      const lowEmitter = sortedCo2[sortedCo2.length - 1];
      const co2Ratio = (emitter.clean.co2_pc / (lowEmitter.clean.co2_pc || 0.01)).toFixed(
        1
      );
      insights.push(
        `${emitter.country} emits ${emitter.clean.co2_pc.toFixed(
          1
        )} tonnes of CO₂ per person (${co2Ratio}× ${lowEmitter.country}'s ${lowEmitter.clean.co2_pc.toFixed(
          2
        )} tonnes).`
      );
    }

    return insights;
  }, [selectedCountries]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-brand-navy">Loading Comparison Studio...</p>
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
              Comparative Analysis Studio
            </span>
            <span className="text-xs text-brand-textMuted">• Select 2 to 5 Countries</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mt-1">
            Country Comparison Studio
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted mt-1">
            Evaluate multidimensional trade-offs, health survival gaps, and livability balances across selected nations.
          </p>
        </div>

        <ExportButton
          data={selectedCountries.map((c) => ({
            Country: c.country,
            GDP_per_capita: c.clean.gdp_pc,
            Life_Expectancy: c.clean.life_exp,
            Infant_Mortality: c.clean.inf_mort,
            CO2_per_capita: c.clean.co2_pc,
            Physicians_per_1k: c.clean.physicians,
            Unemployment_pct: c.clean.unemployment,
            Tertiary_enrolment_pct: c.clean.tertiary,
            Forest_pct: c.clean.forest,
            Livability_Index: c.index ? c.index.index_score : null,
            Index_Rank: c.index ? c.index.index_rank : null,
          }))}
          filename="beyond_gdp_comparison"
          label="Download Comparison CSV"
        />
      </div>

      {/* Country Selection Bar */}
      <div className="editorial-card p-5 bg-white space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {selectedCountryNames.map((name, idx) => (
              <span
                key={name}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: COUNTRY_COLORS[idx % COUNTRY_COLORS.length] }}
              >
                <span>{name}</span>
                {selectedCountryNames.length > 2 && (
                  <button
                    onClick={() => removeCountry(name)}
                    className="hover:opacity-75 focus:outline-none"
                    title="Remove country"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>

          {selectedCountryNames.length < 5 && (
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Add country to compare..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-brand-border bg-brand-lightBg focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
              {availableCountries.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-brand-border rounded-md shadow-lg z-20 max-h-48 overflow-y-auto text-xs">
                  {availableCountries.map((c) => (
                    <button
                      key={c.country}
                      onClick={() => addCountry(c.country)}
                      className="w-full text-left px-3 py-2 hover:bg-brand-lightBg flex items-center justify-between"
                    >
                      <span className="font-medium text-brand-navy">{c.country}</span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        ${Math.round(c.clean.gdp_pc).toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Country Profile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {selectedCountries.map((c, idx) => {
          const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];
          return (
            <div
              key={c.country}
              className="editorial-card p-4 relative overflow-hidden flex flex-col justify-between"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: color }}
              />
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-serif text-lg font-bold text-brand-navy">
                    {c.country}
                  </h3>
                  <Link
                    href={`/countries/${encodeURIComponent(c.country)}`}
                    className="text-brand-textMuted hover:text-brand-teal"
                    title="View full country profile"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <p className="text-[11px] text-brand-textMuted mt-0.5">
                  {c.clean.income_quartile}
                </p>

                <div className="mt-3 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-brand-textMuted font-sans">GDPpc:</span>
                    <span className="font-semibold text-brand-navy">
                      ${Math.round(c.clean.gdp_pc).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-textMuted font-sans">Life Exp:</span>
                    <span className="font-semibold text-brand-teal">
                      {c.clean.life_exp.toFixed(1)} yrs
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-textMuted font-sans">CO₂ pc:</span>
                    <span className="font-semibold text-brand-navy">
                      {c.clean.co2_pc !== null ? `${c.clean.co2_pc.toFixed(1)} t` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-textMuted font-sans">Index Rank:</span>
                    <span className="font-semibold text-brand-deepTeal">
                      {c.index ? `#${c.index.index_rank}` : "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-brand-border/60 text-[10px] text-brand-textMuted">
                {c.index ? (
                  <span>
                    Shift vs GDP:{" "}
                    <strong
                      className={c.index.rank_shift >= 0 ? "text-emerald-600" : "text-rose-600"}
                    >
                      {c.index.rank_shift >= 0 ? "+" : ""}
                      {c.index.rank_shift}
                    </strong>
                  </span>
                ) : (
                  <span>Partial indicator set</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Radar Chart & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="editorial-card p-6">
          <div className="mb-4 pb-3 border-b border-brand-border">
            <h3 className="font-serif text-xl font-bold text-brand-navy">
              Multidimensional Livability Radar
            </h3>
            <p className="text-xs text-brand-textMuted">
              Normalized scores (0–100) across Health, Social, Economic, and Environmental dimensions.
            </p>
          </div>
          <RadarComparison
            data={radarData}
            countries={selectedCountries.map((c, idx) => ({
              name: c.country,
              color: COUNTRY_COLORS[idx % COUNTRY_COLORS.length],
            }))}
            height={360}
          />
        </div>

        <div className="editorial-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-brand-border">
              <Info className="w-4 h-4 text-brand-teal" />
              <h3 className="font-serif text-xl font-bold text-brand-navy">
                Mathematical Comparison Insights
              </h3>
            </div>
            <p className="text-xs text-brand-textMuted mb-4">
              Deterministic calculations derived directly from the verified dataset:
            </p>

            <div className="space-y-3">
              {comparisonInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-brand-lightBg border border-brand-border text-xs text-brand-text leading-relaxed flex items-start space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-teal mt-1.5 flex-shrink-0" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3.5 rounded-lg bg-brand-ivory border border-brand-amber/30 text-xs text-brand-text leading-relaxed">
            <strong className="text-brand-navy block mb-1">Analytical Note:</strong>
            These comparisons highlight that economic dominance does not guarantee environmental
            moderation or healthcare efficiency. Each country represents a distinct development trade-off profile.
          </div>
        </div>
      </div>

      {/* Side-by-Side Indicator Table */}
      <div className="editorial-card p-6 overflow-x-auto">
        <h3 className="font-serif text-xl font-bold text-brand-navy mb-1">
          Detailed Side-by-Side Indicator Matrix
        </h3>
        <p className="text-xs text-brand-textMuted mb-4">
          All eight core project indicators with exact values and units.
        </p>

        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border text-brand-textMuted font-semibold">
              <th className="py-2.5 pr-4">Dimension & Indicator</th>
              {selectedCountries.map((c, idx) => (
                <th
                  key={c.country}
                  className="py-2.5 px-3 text-right"
                  style={{ color: COUNTRY_COLORS[idx % COUNTRY_COLORS.length] }}
                >
                  {c.country}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/60">
            {/* Economic */}
            <tr className="bg-brand-lightBg/30">
              <td colSpan={selectedCountries.length + 1} className="py-1 px-2 font-bold text-[#4777A8]">
                ECONOMIC DIMENSION
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium text-brand-navy">
                GDP per capita (US$)
              </td>
              {selectedCountries.map((c) => (
                <td key={c.country} className="py-2 px-3 text-right font-mono font-semibold">
                  ${Math.round(c.clean.gdp_pc).toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium text-brand-navy">
                Unemployment Rate (%)
              </td>
              {selectedCountries.map((c) => (
                <td key={c.country} className="py-2 px-3 text-right font-mono">
                  {c.clean.unemployment !== null ? `${c.clean.unemployment.toFixed(1)}%` : "Not available"}
                </td>
              ))}
            </tr>

            {/* Health */}
            <tr className="bg-brand-lightBg/30">
              <td colSpan={selectedCountries.length + 1} className="py-1 px-2 font-bold text-[#159A91]">
                HEALTH DIMENSION
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium text-brand-navy">
                Life Expectancy (years)
              </td>
              {selectedCountries.map((c) => (
                <td key={c.country} className="py-2 px-3 text-right font-mono font-semibold text-brand-teal">
                  {c.clean.life_exp.toFixed(1)} yrs
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium text-brand-navy">
                Infant Mortality (per 1,000 live births)
              </td>
              {selectedCountries.map((c) => (
                <td key={c.country} className="py-2 px-3 text-right font-mono">
                  {c.clean.inf_mort !== null ? c.clean.inf_mort.toFixed(1) : "Not available"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium text-brand-navy">
                Physicians (per 1,000 people)
              </td>
              {selectedCountries.map((c) => (
                <td key={c.country} className="py-2 px-3 text-right font-mono">
                  {c.clean.physicians !== null ? c.clean.physicians.toFixed(2) : "Not available"}
                </td>
              ))}
            </tr>

            {/* Social */}
            <tr className="bg-brand-lightBg/30">
              <td colSpan={selectedCountries.length + 1} className="py-1 px-2 font-bold text-[#D9A441]">
                SOCIAL DIMENSION
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium text-brand-navy">
                Tertiary Enrolment (Gross %, max 100)
              </td>
              {selectedCountries.map((c) => (
                <td key={c.country} className="py-2 px-3 text-right font-mono">
                  {c.clean.tertiary !== null ? `${c.clean.tertiary.toFixed(1)}%` : "Not available"}
                </td>
              ))}
            </tr>

            {/* Environmental */}
            <tr className="bg-brand-lightBg/30">
              <td colSpan={selectedCountries.length + 1} className="py-1 px-2 font-bold text-[#6B9D78]">
                ENVIRONMENTAL DIMENSION
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium text-brand-navy">
                CO₂ Emissions per capita (metric tonnes)
              </td>
              {selectedCountries.map((c) => (
                <td key={c.country} className="py-2 px-3 text-right font-mono font-semibold">
                  {c.clean.co2_pc !== null ? `${c.clean.co2_pc.toFixed(2)} t` : "Not available"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium text-brand-navy">
                Forested Area (% of land)
              </td>
              {selectedCountries.map((c) => (
                <td key={c.country} className="py-2 px-3 text-right font-mono">
                  {c.clean.forest !== null ? `${c.clean.forest.toFixed(1)}%` : "Not available"}
                </td>
              ))}
            </tr>

            {/* Index & Residual */}
            <tr className="bg-brand-lightBg/30">
              <td colSpan={selectedCountries.length + 1} className="py-1 px-2 font-bold text-brand-navy">
                COMPOSITE EVALUATION & RESIDUAL
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium text-brand-navy">
                Livability Composite Score (0–100)
              </td>
              {selectedCountries.map((c) => (
                <td key={c.country} className="py-2 px-3 text-right font-mono font-bold text-brand-deepTeal">
                  {c.index ? c.index.index_score.toFixed(1) : "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium text-brand-navy">
                Livability Rank vs GDP Rank
              </td>
              {selectedCountries.map((c) => (
                <td key={c.country} className="py-2 px-3 text-right font-mono">
                  {c.index ? `#${c.index.index_rank} (GDP #${c.index.gdp_rank})` : "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium text-brand-navy">
                Wealth–Health Residual (years)
              </td>
              {selectedCountries.map((c) => (
                <td
                  key={c.country}
                  className={`py-2 px-3 text-right font-mono font-bold ${
                    c.clean.residual_life_exp >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {c.clean.residual_life_exp >= 0 ? "+" : ""}
                  {c.clean.residual_life_exp.toFixed(1)} yrs
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
