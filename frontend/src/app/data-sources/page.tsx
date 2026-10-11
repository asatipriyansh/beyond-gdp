import React from "react";
import Link from "next/link";
import {
  Database,
  ExternalLink,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  Globe,
  Info,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const INDICATOR_DICTIONARY = [
  {
    indicator: "Country",
    rawCol: "Country",
    derivedCol: "country",
    unit: "String",
    definition: "Sovereign nation or territory name",
    sourceOrg: "UN / ISO 3166-1",
    missingRaw: 0,
    validClean: 141,
  },
  {
    indicator: "Gross Domestic Product (Aggregate)",
    rawCol: "GDP",
    derivedCol: "gdp_bn",
    unit: "Billion US$",
    definition: "Nominal Gross Domestic Product in current US dollars",
    sourceOrg: "World Bank WDI",
    missingRaw: 2,
    validClean: 141,
  },
  {
    indicator: "Total Population",
    rawCol: "Population",
    derivedCol: "pop_m",
    unit: "Millions",
    definition: "Mid-year total resident national population",
    sourceOrg: "UN Population Division",
    missingRaw: 1,
    validClean: 141,
  },
  {
    indicator: "GDP per capita (Derived)",
    rawCol: "Derived",
    derivedCol: "gdp_pc",
    unit: "US$ per person",
    definition: "Calculated as (GDP in billions × 10⁹) / (Population in millions × 10⁶)",
    sourceOrg: "Derived from World Bank WDI",
    missingRaw: 2,
    validClean: 141,
  },
  {
    indicator: "Life Expectancy at Birth",
    rawCol: "Life expectancy",
    derivedCol: "life_exp",
    unit: "Years",
    definition: "Expected lifespan of a newborn if mortality rates remain constant",
    sourceOrg: "WHO / World Bank WDI",
    missingRaw: 5,
    validClean: 141,
  },
  {
    indicator: "Infant Mortality Rate",
    rawCol: "Infant mortality",
    derivedCol: "inf_mort",
    unit: "Deaths per 1,000 live births",
    definition: "Probability of dying before reaching age one per 1,000 live births",
    sourceOrg: "UN IGME / WHO",
    missingRaw: 6,
    validClean: 139,
  },
  {
    indicator: "Physicians Density",
    rawCol: "Physicians per thousand",
    derivedCol: "physicians",
    unit: "Physicians per 1,000 people",
    definition: "Registered medical doctors per 1,000 population",
    sourceOrg: "WHO Global Health Observatory",
    missingRaw: 7,
    validClean: 139,
  },
  {
    indicator: "Unemployment Rate",
    rawCol: "Unemployment rate",
    derivedCol: "unemployment",
    unit: "% of total labor force",
    definition: "Share of labor force that is without work but available and seeking",
    sourceOrg: "ILOSTAT",
    missingRaw: 14,
    validClean: 133,
  },
  {
    indicator: "Gross Tertiary Enrolment",
    rawCol: "Gross tertiary education enrollment (%)",
    derivedCol: "tertiary",
    unit: "% (capped at 100)",
    definition: "Total enrolment in tertiary education regardless of age, capped at 100%",
    sourceOrg: "UNESCO Institute for Statistics",
    missingRaw: 12,
    validClean: 135,
  },
  {
    indicator: "CO₂ Emissions (Aggregate)",
    rawCol: "Co2-Emissions",
    derivedCol: "co2_kt",
    unit: "Kilotonnes (kt)",
    definition: "Carbon dioxide emissions stemming from burning fossil fuels",
    sourceOrg: "EDGAR / World Bank",
    missingRaw: 7,
    validClean: 139,
  },
  {
    indicator: "CO₂ per capita (Derived)",
    rawCol: "Derived",
    derivedCol: "co2_pc",
    unit: "Metric tonnes per person",
    definition: "Calculated as CO2_kt / (Population_millions × 1000)",
    sourceOrg: "Derived from EDGAR / UN",
    missingRaw: 7,
    validClean: 139,
  },
  {
    indicator: "Forested Land Area",
    rawCol: "Forested Area (%)",
    derivedCol: "forest",
    unit: "% of total land area",
    definition: "Land under natural or planted stands of trees of at least 5 meters in situ",
    sourceOrg: "FAO Global Forest Assessment",
    missingRaw: 7,
    validClean: 139,
  },
];

export default function DataSourcesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="pb-6 border-b border-brand-border">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-deepTeal">
            Data Integrity & Provenance
          </span>
          <span className="text-xs text-brand-textMuted">• Verified Multi-Source Audit</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-navy">
          Data Sources & Provenance Registry
        </h1>
        <p className="text-sm sm:text-base text-brand-textMuted mt-2 leading-relaxed">
          Comprehensive traceability for all indicators, including original publication series,
          cleansing decisions, units of measurement, and complete downloadable artifacts.
        </p>
      </div>

      {/* Dataset Quality Audit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Raw Dataset Size"
          value="146 Countries"
          subtext="World 2023 Kaggle snapshot"
          badge="Raw Sample"
          dimensionColor="#102A36"
        />
        <StatCard
          title="Validated Clean Dataset"
          value="141 Countries"
          subtext="Complete GDP & Life Exp data"
          badge="Bivariate Core"
          dimensionColor="#159A91"
        />
        <StatCard
          title="Index Analysis Sample"
          value="131 Countries"
          subtext="Full 7-indicator completeness"
          badge="Composite Sample"
          dimensionColor="#D9A441"
        />
        <StatCard
          title="Indicators Profiled"
          value="8 Core Metrics"
          subtext="Economic, Health, Social, Env"
          badge="Multidimensional"
          dimensionColor="#6B9D78"
        />
      </div>

      {/* Primary Multilateral Provenance Organizations */}
      <div className="editorial-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-brand-border">
          <Globe className="w-5 h-5 text-brand-teal" />
          <h2 className="font-serif text-2xl font-bold text-brand-navy">
            Institutional Data Sources
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
          The underlying 2023 dataset consolidates indicators collected, harmonized, and verified by principal multilateral statistical agencies:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-lg bg-brand-lightBg border border-brand-border flex flex-col justify-between">
            <div>
              <span className="font-bold text-brand-navy text-sm block mb-1">
                World Bank (WDI)
              </span>
              <p className="text-brand-textMuted leading-relaxed">
                Source for national Gross Domestic Product (current US$), infant mortality series, and agricultural/environmental metrics.
              </p>
            </div>
            <a
              href="https://databank.worldbank.org/source/world-development-indicators"
              target="_blank"
              rel="noreferrer"
              className="mt-3 text-brand-deepTeal font-semibold inline-flex items-center space-x-1 hover:underline"
            >
              <span>databank.worldbank.org</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-4 rounded-lg bg-brand-lightBg border border-brand-border flex flex-col justify-between">
            <div>
              <span className="font-bold text-brand-navy text-sm block mb-1">
                World Health Organization (WHO)
              </span>
              <p className="text-brand-textMuted leading-relaxed">
                Source for life expectancy at birth and clinical human resources (physicians per 1,000 residents).
              </p>
            </div>
            <a
              href="https://www.who.int/data/gho"
              target="_blank"
              rel="noreferrer"
              className="mt-3 text-brand-deepTeal font-semibold inline-flex items-center space-x-1 hover:underline"
            >
              <span>who.int/data/gho</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-4 rounded-lg bg-brand-lightBg border border-brand-border flex flex-col justify-between">
            <div>
              <span className="font-bold text-brand-navy text-sm block mb-1">
                Our World in Data & UNdata
              </span>
              <p className="text-brand-textMuted leading-relaxed">
                Harmonized metrics for CO₂ emissions (EDGAR inventory), demographic censuses, and UNESCO tertiary enrolment ratios.
              </p>
            </div>
            <a
              href="https://ourworldindata.org"
              target="_blank"
              rel="noreferrer"
              className="mt-3 text-brand-deepTeal font-semibold inline-flex items-center space-x-1 hover:underline"
            >
              <span>ourworldindata.org</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Comprehensive Indicator Dictionary */}
      <div className="editorial-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-brand-border">
          <Database className="w-5 h-5 text-brand-teal" />
          <h2 className="font-serif text-2xl font-bold text-brand-navy">
            Indicator Dictionary & Completeness Audit
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-brand-textMuted font-semibold">
                <th className="py-2.5 pr-3">Indicator Name</th>
                <th className="py-2.5 px-3">Raw Column</th>
                <th className="py-2.5 px-3">Unit</th>
                <th className="py-2.5 px-3">Primary Source</th>
                <th className="py-2.5 px-3 text-right">Missing (Raw 146)</th>
                <th className="py-2.5 pl-3 text-right">Valid (Clean 141)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {INDICATOR_DICTIONARY.map((ind) => (
                <tr key={ind.indicator} className="hover:bg-brand-lightBg/50">
                  <td className="py-3 pr-3 font-semibold text-brand-navy">
                    {ind.indicator}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-brand-textMuted">
                    {ind.rawCol}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-gray-700">
                    {ind.unit}
                  </td>
                  <td className="py-3 px-3 text-brand-textMuted">
                    {ind.sourceOrg}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    {ind.missingRaw > 0 ? (
                      <span className="text-rose-600 font-bold">{ind.missingRaw}</span>
                    ) : (
                      <span className="text-emerald-600">0</span>
                    )}
                  </td>
                  <td className="py-3 pl-3 text-right font-mono font-semibold text-brand-navy">
                    {ind.validClean}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Downloads Section */}
      <div className="editorial-card p-6 sm:p-8 bg-brand-navy text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-mint block mb-1">
            Open Access Research Artifacts
          </span>
          <h3 className="font-serif text-2xl font-bold">
            Download Cleaned Data & Models
          </h3>
          <p className="text-xs text-gray-300 mt-1 max-w-xl">
            Access the exact tabular datasets generated by our Python pipeline for secondary analysis or pedagogical replication.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/data/clean.csv"
            download="beyond_gdp_clean.csv"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-brand-teal hover:bg-brand-deepTeal text-white text-xs font-semibold shadow transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Clean Dataset (141)</span>
          </a>
          <a
            href="/data/index.csv"
            download="beyond_gdp_index.csv"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-brand-darkSurface hover:bg-white/10 border border-brand-teal/40 text-brand-mint text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Index Dataset (131)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
