import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Filter,
  Calculator,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Download,
  FileCode,
} from "lucide-react";
import DimensionBadge from "@/components/DimensionBadge";

export default function MethodologyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="pb-6 border-b border-brand-border">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-deepTeal">
            Scientific Pipeline & Rigor
          </span>
          <span className="text-xs text-brand-textMuted">• Exploratory Data Analysis BACSE301</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-navy">
          Methodology & Mathematical Framework
        </h1>
        <p className="text-sm sm:text-base text-brand-textMuted mt-2 leading-relaxed">
          Comprehensive documentation of data cleaning, indicator derivation, statistical transformations,
          and composite index formulations applied across the 146-country dataset.
        </p>
      </div>

      {/* 1. Dataset Preprocessing & Cleaning */}
      <section className="editorial-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-brand-border">
          <Filter className="w-5 h-5 text-brand-teal" />
          <h2 className="font-serif text-2xl font-bold text-brand-navy">
            1. Preprocessing & Data Cleaning Protocol
          </h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-brand-text leading-relaxed">
          <p>
            The raw dataset consists of 146 sovereign countries with 10 original columns representing economic, demographic, educational, and environmental variables. Prior to conducting bivariate correlations or regression models, four critical cleaning steps were enforced:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-brand-lightBg border border-brand-border space-y-2">
              <h3 className="font-serif font-bold text-base text-brand-navy">
                Capping Gross Tertiary Enrolment
              </h3>
              <p className="text-xs text-brand-textMuted">
                Gross enrolment ratios (GER) frequently exceed 100% in international reporting because students of non-standard ages (mature students, grade repeaters) enroll in universities. Values were systematically capped at 100.0% to reflect population coverage bounds.
              </p>
              <div className="font-mono text-[11px] bg-white p-2 rounded border border-brand-border text-brand-navy">
                Tertiary_Capped = min(Tertiary_Gross, 100.0)
              </div>
            </div>

            <div className="p-4 rounded-lg bg-brand-lightBg border border-brand-border space-y-2">
              <h3 className="font-serif font-bold text-base text-brand-navy">
                Handling Missing Life Expectancy
              </h3>
              <p className="text-xs text-brand-textMuted">
                Five countries in the 146-record dataset lacked reported Life Expectancy: Andorra, Monaco, Nauru, North Macedonia, and Eswatini. Rather than distorting regression curves with synthetic imputations, these 5 records were excluded from regression, yielding the 141-country Clean Dataset.
              </p>
              <div className="font-mono text-[11px] bg-white p-2 rounded border border-brand-border text-brand-navy">
                Clean_Dataset: Drop if isNull(Life_Expectancy) (n = 141)
              </div>
            </div>

            <div className="p-4 rounded-lg bg-brand-lightBg border border-brand-border space-y-2">
              <h3 className="font-serif font-bold text-base text-brand-navy">
                Deriving GDP per Capita
              </h3>
              <p className="text-xs text-brand-textMuted">
                Raw data contained aggregate GDP in billions of US$ and Population in millions. Per-capita economic output was calculated directly:
              </p>
              <div className="font-mono text-[11px] bg-white p-2 rounded border border-brand-border text-brand-navy">
                GDPpc = (GDP_billions × 10⁹) / (Population_millions × 10⁶) = (GDP_billions / Population_millions) × 1000
              </div>
            </div>

            <div className="p-4 rounded-lg bg-brand-lightBg border border-brand-border space-y-2">
              <h3 className="font-serif font-bold text-base text-brand-navy">
                Deriving CO₂ Emissions per Capita
              </h3>
              <p className="text-xs text-brand-textMuted">
                Raw emissions were recorded in kilotonnes (kt). Converting to metric tonnes per person:
              </p>
              <div className="font-mono text-[11px] bg-white p-2 rounded border border-brand-border text-brand-navy">
                CO2pc = (CO2_kt × 1000) / (Population_millions × 10⁶) = CO2_kt / (Population_millions × 1000)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statistical Transformations & Outliers */}
      <section className="editorial-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-brand-border">
          <Calculator className="w-5 h-5 text-brand-teal" />
          <h2 className="font-serif text-2xl font-bold text-brand-navy">
            2. Statistical Modeling & Outlier Identification
          </h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-brand-text leading-relaxed">
          <p>
            Macroeconomic variables exhibit strong positive skewness. For instance, GDP per capita displays a rightward skewness coefficient of 3.50 (Mean $14,792 vs. Median $6,076). Logarithmic transformations were employed for regression modeling:
          </p>

          <div className="p-4 rounded-lg bg-brand-ivory border border-brand-border space-y-2">
            <h4 className="font-serif font-bold text-brand-navy">
              Ordinary Least Squares (OLS) Health Regression
            </h4>
            <p className="text-xs text-brand-textMuted">
              Modeled on 141 clean nations using log₁₀(GDP per capita) as the independent regressor:
            </p>
            <div className="font-mono text-xs bg-white p-3 rounded border border-brand-border text-brand-deepTeal">
              Fitted Life Expectancy = −18.42 + 23.49 × log₁₀(GDPpc)
            </div>
            <p className="text-xs text-brand-textMuted">
              Model Fit: r = 0.83, R² = 0.69 (69% of global variance in longevity explained by income level alone), p &lt; 0.0001. Slope implies that doubling GDP per capita yields approximately +3.01 years of additional life expectancy (23.49 × log₁₀(2) ≈ 3.07).
            </p>
          </div>

          <div className="p-4 rounded-lg bg-brand-lightBg border border-brand-border space-y-2">
            <h4 className="font-serif font-bold text-brand-navy">
              Interquartile Range (IQR) Outlier Rule
            </h4>
            <p className="text-xs text-brand-textMuted">
              Outliers are detected strictly via Tukey’s 1.5 × IQR fence rule:
            </p>
            <div className="font-mono text-xs bg-white p-3 rounded border border-brand-border text-brand-navy">
              IQR = Q₃ − Q₁; &nbsp;&nbsp; Upper Fence = Q₃ + 1.5 × IQR
            </div>
            <p className="text-xs text-brand-textMuted">
              Applied systematically across GDP per capita (fence $49,901; 15 outliers), CO₂ per capita (fence 12.50 tonnes; 8 outliers), Physician density (fence 5.48/1k; 4 outliers), and Unemployment (fence 19.3%; 2 outliers).
            </p>
          </div>
        </div>
      </section>

      {/* 3. Exploratory Livability Index Formulation */}
      <section className="editorial-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-brand-border">
          <BookOpen className="w-5 h-5 text-brand-teal" />
          <h2 className="font-serif text-2xl font-bold text-brand-navy">
            3. The Composite Livability Index Formulation
          </h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-brand-text leading-relaxed">
          <p>
            To evaluate multidimensional livability, 131 countries with complete records across all indicators were normalized onto a 0–100 scale using min-max scaling:
          </p>

          <div className="p-4 rounded-lg bg-white border border-brand-border font-mono text-xs text-brand-navy">
            <p>Score_standard = (X_i − min(X)) / (max(X) − min(X)) × 100</p>
            <p className="mt-1 text-gray-500">Score_inverted = (max(X) − X_i) / (max(X) − min(X)) × 100 &nbsp; (for Infant Mortality, Unemployment, CO₂)</p>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="font-serif font-bold text-brand-navy text-sm">
              Dimension Definitions:
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#159A91] w-24 flex-shrink-0">Health (25%):</span>
                <span>Average of Life Expectancy score, inverted Infant Mortality score, and Physician density score.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#D9A441] w-24 flex-shrink-0">Social (25%):</span>
                <span>Standardized Tertiary Enrolment Gross % (capped at 100).</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#4777A8] w-24 flex-shrink-0">Economic (25%):</span>
                <span>Average of log-transformed GDP per capita score and inverted Unemployment score.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#6B9D78] w-24 flex-shrink-0">Environment (25%):</span>
                <span>Weighted combination of inverted CO₂ emissions per capita (70%) and Forested land % (30%).</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Limitations & Academic Transparency */}
      <section className="editorial-card p-6 sm:p-8 space-y-6 bg-brand-lightBg/50">
        <div className="flex items-center space-x-3 pb-3 border-b border-brand-border">
          <AlertTriangle className="w-5 h-5 text-brand-coral" />
          <h2 className="font-serif text-2xl font-bold text-brand-navy">
            4. Analytical Limitations & Caveats
          </h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-brand-text leading-relaxed">
          <div className="p-3.5 rounded bg-white border border-brand-border">
            <span className="font-bold text-brand-navy block mb-0.5">Cross-Sectional 2023 Snapshot</span>
            <p className="text-xs text-brand-textMuted">
              Data represents a static single-year cross-section. It documents static associations, not dynamic temporal trajectories or guaranteed causality.
            </p>
          </div>

          <div className="p-3.5 rounded bg-white border border-brand-border">
            <span className="font-bold text-brand-navy block mb-0.5">National Averages Obscure Internal Inequality</span>
            <p className="text-xs text-brand-textMuted">
              National per capita metrics mask internal Gini income disparities, gender inequality, and regional rural–urban healthcare access chasms.
            </p>
          </div>

          <div className="p-3.5 rounded bg-white border border-brand-border">
            <span className="font-bold text-brand-navy block mb-0.5">Imputation Transparency</span>
            <p className="text-xs text-brand-textMuted">
              Countries lacking full indicators were kept strictly separated from complete-case index rankings rather than corrupting variance with regression imputation.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Downloads */}
      <div className="editorial-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-brand-navy">
            Reproduce the Analysis
          </h3>
          <p className="text-xs text-brand-textMuted">
            Download the processed data artifacts used to construct this platform.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/data/clean.csv"
            download="beyond_gdp_clean.csv"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-md bg-brand-navy text-white text-xs font-semibold hover:bg-brand-deepTeal transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Clean Dataset (141)</span>
          </a>
          <a
            href="/data/index.csv"
            download="beyond_gdp_index.csv"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-md bg-white border border-brand-border text-brand-navy text-xs font-semibold hover:bg-brand-lightBg transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Index Dataset (131)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
