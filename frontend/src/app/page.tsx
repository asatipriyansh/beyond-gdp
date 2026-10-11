import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  HeartPulse,
  Users,
  Leaf,
  ShieldAlert,
  Sliders,
  FileSpreadsheet,
  Activity,
  Award,
  Globe2,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import DimensionBadge from "@/components/DimensionBadge";
import ScatterPlot from "@/components/Charts/ScatterPlot";
import {
  getCleanCountries,
  getSummaryStats,
  getCorrelations,
  getIndexRankings,
  getIncomeQuartiles,
  getOutliers,
} from "@/lib/data";

export default function HomePage() {
  const cleanCountries = getCleanCountries();
  const summaryStats = getSummaryStats();
  const correlations = getCorrelations();
  const indexRankings = getIndexRankings();
  const incomeQuartiles = getIncomeQuartiles();
  const outliers = getOutliers();

  // Focal correlation: logGDP vs LifeExp
  const focalGdpLe = correlations.focal_correlations.logGDP_LifeExp;

  // Scatter plot data for Wealth vs Life Expectancy
  const scatterPoints = cleanCountries.map((c) => ({
    country: c.country,
    x: c.clean!.gdp_pc,
    y: c.clean!.life_exp,
    highlight: [
      "Qatar",
      "Equatorial Guinea",
      "Nicaragua",
      "Albania",
      "Morocco",
      "Finland",
      "Norway",
      "Japan",
      "Central African Republic",
    ].includes(c.country),
  }));

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section */}
      <section className="bg-brand-navy text-white pt-20 pb-24 relative overflow-hidden border-b border-brand-teal/30">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#159A91_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-darkSurface border border-brand-teal/40 text-brand-mint text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
              <span>Exploratory Data Analysis Research Project • 2026–27</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-4">
              Beyond GDP.
            </h1>
            <p className="font-serif text-2xl sm:text-3xl text-brand-mint/90 italic mb-6">
              What really makes a country livable?
            </p>

            <p className="text-base sm:text-lg text-gray-300 font-sans leading-relaxed mb-10 max-w-2xl">
              Economic prosperity matters. But health, education, employment, and
              environmental sustainability tell a much bigger story about how people live.
              An exploratory study of 146 nations discovering trade-offs, unexpected outliers,
              and non-linear development dynamics.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link
                href="/explore"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-lg bg-brand-teal hover:bg-brand-deepTeal text-white text-sm font-semibold shadow-md transition"
              >
                <span>Explore the Data</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/methodology"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-lg bg-brand-darkSurface hover:bg-brand-darkSurface/80 border border-brand-teal/40 text-white text-sm font-medium transition"
              >
                <span>Understand the Methodology</span>
              </Link>
              <Link
                href="/livability-index"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-lg bg-transparent hover:bg-white/10 text-brand-mint text-sm font-medium transition"
              >
                <Sliders className="w-4 h-4" />
                <span>Try Interactive Index</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Verified Findings Stats Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Wealth–Life Exp Link"
            value="r = 0.83"
            subtext="+3 yrs life per GDP doubling (R² = 0.69)"
            badge="Health vs log GDP"
            dimensionColor="#159A91"
            icon={TrendingUp}
          />
          <StatCard
            title="The Carbon Penalty"
            value="27×"
            subtext="0.26 t in Q1 vs 7.10 t in Q4 median"
            badge="Environmental"
            dimensionColor="#6B9D78"
            icon={Leaf}
          />
          <StatCard
            title="Deep Health Gap"
            value="64 vs 81 yrs"
            subtext="Infant mort. falls from 45 to 3 / 1,000"
            badge="Q1 vs Q4 Quartiles"
            dimensionColor="#E47D62"
            icon={HeartPulse}
          />
          <StatCard
            title="Index Decoupling"
            value="63 Places"
            subtext="Qatar drops from #5 to #68 on livability"
            badge="Exploratory Index"
            dimensionColor="#D9A441"
            icon={Award}
          />
        </div>
      </section>

      {/* 3. The Four Dimensions of Livability */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 mb-2">
            <span className="h-px w-8 bg-brand-deepTeal" />
            <span className="text-xs uppercase font-bold tracking-widest text-brand-deepTeal">
              Analytical Framework
            </span>
            <span className="h-px w-8 bg-brand-deepTeal" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-brand-navy">
            The Four Dimensions of Livability
          </h2>
          <p className="mt-2 text-sm text-brand-textMuted">
            Conventional assessments flatten country performance into output. We examine
            how four distinct dimensions behave independently and in conflict.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Dimension 1: Economic */}
          <div className="editorial-card p-6 flex flex-col justify-between border-t-4 border-t-[#4777A8]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <DimensionBadge dimension="Economic" />
                <span className="text-xs font-mono text-brand-textMuted">r = 0.04 with Unemp</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-navy mb-2">
                Economic Output & Labor
              </h3>
              <p className="text-xs text-brand-textMuted leading-relaxed">
                Measured by GDP per capita (derived) and unemployment rate. Shows that higher
                national GDP does not systematically guarantee low joblessness across nations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-brand-border/60 text-xs">
              <span className="text-brand-navy font-semibold">Key Indicator:</span>
              <p className="text-brand-textMuted mt-0.5">GDP per capita ($261 to $172,368)</p>
            </div>
          </div>

          {/* Dimension 2: Health */}
          <div className="editorial-card p-6 flex flex-col justify-between border-t-4 border-t-[#159A91]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <DimensionBadge dimension="Health" />
                <span className="text-xs font-mono text-brand-textMuted">r = -0.93 LE vs InfMort</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-navy mb-2">
                Survival & Health Access
              </h3>
              <p className="text-xs text-brand-textMuted leading-relaxed">
                Measured by life expectancy, infant mortality, and physician density.
                Health indicators demonstrate the tightest mutual correlation in the entire dataset.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-brand-border/60 text-xs">
              <span className="text-brand-navy font-semibold">Key Indicator:</span>
              <p className="text-brand-textMuted mt-0.5">Life Expectancy (52.8 to 84.2 years)</p>
            </div>
          </div>

          {/* Dimension 3: Social */}
          <div className="editorial-card p-6 flex flex-col justify-between border-t-4 border-t-[#D9A441]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <DimensionBadge dimension="Social" />
                <span className="text-xs font-mono text-brand-textMuted">r = 0.72 with log GDP</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-navy mb-2">
                Educational Enrolment
              </h3>
              <p className="text-xs text-brand-textMuted leading-relaxed">
                Measured through gross tertiary school enrolment. Strongly tied to industrial
                wealth, but capped at 100% to resolve gross enrolment ratio distortions.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-brand-border/60 text-xs">
              <span className="text-brand-navy font-semibold">Key Indicator:</span>
              <p className="text-brand-textMuted mt-0.5">Tertiary Enrolment (0.8% to 100%)</p>
            </div>
          </div>

          {/* Dimension 4: Environmental */}
          <div className="editorial-card p-6 flex flex-col justify-between border-t-4 border-t-[#6B9D78]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <DimensionBadge dimension="Environmental" />
                <span className="text-xs font-mono text-brand-textMuted">r = 0.87 log GDP vs log CO₂</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-navy mb-2">
                Sustainability & Forests
              </h3>
              <p className="text-xs text-brand-textMuted leading-relaxed">
                Measured through per capita CO₂ emissions and percentage forest cover. Highlights
                the clear environmental penalty that accompanies economic ascension.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-brand-border/60 text-xs">
              <span className="text-brand-navy font-semibold">Key Indicator:</span>
              <p className="text-brand-textMuted mt-0.5">CO₂ per capita (0.02 to 36.49 t)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Focal Visualization: Wealth vs. Life Expectancy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="editorial-card p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-brand-border">
            <div>
              <div className="flex items-center space-x-2">
                <DimensionBadge dimension="Health" size="sm" />
                <span className="text-xs text-brand-textMuted">Bivariate Relationship</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-brand-navy mt-1">
                Wealth Buys Years of Life — But Gains Flatten
              </h2>
              <p className="text-xs text-brand-textMuted mt-1">
                Life expectancy vs. GDP per capita (US$, log scale). Slope = +3.01 years per GDP doubling (r = 0.83).
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5 text-xs text-brand-textMuted">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E47D62]" />
                <span>Noteworthy Outliers</span>
              </div>
              <Link
                href="/relationships"
                className="text-xs font-semibold text-brand-deepTeal hover:underline flex items-center space-x-1"
              >
                <span>Full Relationship Explorer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <ScatterPlot
                data={scatterPoints}
                xAxisLabel="GDP per capita (US$, log scale)"
                yAxisLabel="Life Expectancy (years)"
                xScale="log"
                highlightCountries={[
                  "Qatar",
                  "Equatorial Guinea",
                  "Nicaragua",
                  "Albania",
                  "Morocco",
                  "Finland",
                  "Norway",
                  "Japan",
                  "Central African Republic",
                ]}
                height={400}
                yUnit="years"
              />
            </div>

            <div className="lg:col-span-1 bg-brand-lightBg p-5 rounded-lg border border-brand-border flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="font-serif text-base font-bold text-brand-navy">
                  Verified Insights
                </h4>
                <div className="space-y-3 text-xs text-brand-text leading-relaxed">
                  <div className="p-2.5 rounded bg-white border border-brand-border">
                    <p className="font-semibold text-brand-navy">The Non-Linear Curve</p>
                    <p className="text-brand-textMuted mt-1">
                      At low incomes ($500–$5,000), marginal GDP increases buy dramatic life gains.
                      Beyond $30,000, gains plateau toward 82–84 years.
                    </p>
                  </div>
                  <div className="p-2.5 rounded bg-white border border-brand-border">
                    <p className="font-semibold text-brand-coral">Equatorial Guinea (−15.2 yrs)</p>
                    <p className="text-brand-textMuted mt-1">
                      High oil GDP per capita ($8.1k), yet life expectancy is only 58.4 years due to
                      low public spending on healthcare.
                    </p>
                  </div>
                  <div className="p-2.5 rounded bg-white border border-brand-border">
                    <p className="font-semibold text-brand-teal">Nicaragua & Albania (+7.0 yrs)</p>
                    <p className="text-brand-textMuted mt-1">
                      Modest per capita incomes ($1.9k and $5.4k) achieving 74.3 and 78.5 years of life.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-border text-[11px] text-brand-textMuted">
                Statistical Fit: Linear Regression on log₁₀(GDPpc), n = 141, p &lt; 0.0001
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Income Quartiles Comparison (Poorest vs. Richest) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-serif text-3xl font-bold text-brand-navy">
            The Divided World: Quartile Disparities
          </h2>
          <p className="text-xs text-brand-textMuted mt-1">
            Median outcomes across 4 equal-sized income quarters (141 countries).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(incomeQuartiles).map(([qName, qData], idx) => {
            const isPoorest = idx === 0;
            const isRichest = idx === 3;
            return (
              <div
                key={qName}
                className={`editorial-card p-5 ${
                  isRichest
                    ? "ring-2 ring-brand-teal bg-white"
                    : isPoorest
                    ? "ring-1 ring-brand-coral/40 bg-white"
                    : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <span className="font-serif font-bold text-base text-brand-navy">
                    {qName}
                  </span>
                  <span className="text-[11px] font-mono text-brand-textMuted">
                    {qData.country_count} nations
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div>
                    <span className="text-brand-textMuted block">GDPpc Range:</span>
                    <span className="font-mono font-semibold text-brand-navy">
                      ${Math.round(qData.min_gdp).toLocaleString()} – ${Math.round(qData.max_gdp).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-textMuted block">Median Life Expectancy:</span>
                    <span className="font-mono font-semibold text-brand-teal text-sm">
                      {qData.median_life_exp} years
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-textMuted block">Infant Mortality:</span>
                    <span className="font-mono font-semibold text-brand-coral">
                      {qData.median_inf_mort ?? "—"} per 1k
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-textMuted block">CO₂ per capita:</span>
                    <span className="font-mono font-semibold text-brand-navy">
                      {qData.median_co2 ?? "—"} tonnes
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-brand-border text-[11px] text-brand-textMuted">
                  {isPoorest && "High child mortality, low emissions."}
                  {isRichest && "High longevity, 27x carbon output."}
                  {!isPoorest && !isRichest && "Transitional developing stage."}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Exploratory Livability Index Preview */}
      <section className="bg-brand-darkSurface text-white py-16 border-y border-brand-teal/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-navy text-brand-mint text-xs font-medium mb-4">
                <Award className="w-3.5 h-3.5" />
                <span>Multidimensional Composite Index</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight mb-4">
                Why GDP Ranks Do Not Tell the Whole Story
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                Our exploratory livability index normalizes health, social, economic, and
                environmental indicators using min-max scaling across 131 complete-data nations.
                Comparing GDP rank against Livability rank reveals massive deviations.
              </p>

              <div className="space-y-3 mb-8 text-xs">
                <div className="p-3 rounded bg-brand-navy/80 border border-brand-teal/30 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-brand-mint">Qatar</span>
                    <p className="text-gray-400">Extreme emissions (36.5 t) & low tertiary enrolment</p>
                  </div>
                  <div className="text-right">
                    <span className="text-rose-400 font-bold font-mono">−63 Places</span>
                    <p className="text-gray-400">GDP #5 → Index #68</p>
                  </div>
                </div>

                <div className="p-3 rounded bg-brand-navy/80 border border-brand-teal/30 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-brand-mint">Belarus</span>
                    <p className="text-gray-400">5.2 physicians/1k, low infant mortality (2.6)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold font-mono">+53 Places</span>
                    <p className="text-gray-400">GDP #61 → Index #8</p>
                  </div>
                </div>
              </div>

              <Link
                href="/livability-index"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-brand-teal hover:bg-brand-deepTeal text-white text-xs font-semibold transition"
              >
                <span>Launch Interactive Index Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Top 5 Table preview */}
            <div className="bg-brand-navy p-6 rounded-xl border border-brand-teal/30">
              <h3 className="font-serif text-lg font-bold text-white mb-1">
                Top Reported Index Nations (Equal Weights)
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Complete sample of 131 countries.
              </p>
              <div className="divide-y divide-brand-teal/20 text-xs">
                {indexRankings.countries.slice(0, 5).map((c, i) => (
                  <div key={c.Country} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-brand-teal/20 text-brand-mint font-mono font-bold flex items-center justify-center text-xs">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-white">{c.Country}</span>
                        <p className="text-[11px] text-gray-400 font-mono">
                          GDP per capita: ${Math.round(c.GDPpc).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-brand-mint text-sm">
                        {c.Index.toFixed(1)}
                      </span>
                      <p className="text-[10px] text-gray-400 font-mono">
                        GDP #{c.GDPrank}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. EDA Scientific Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl font-bold text-brand-navy">
            Exploratory Data Analysis Workflow
          </h2>
          <p className="text-xs text-brand-textMuted mt-1">
            An evidence-first pipeline emphasizing interpretability and pattern discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { step: "01", title: "Inspection", desc: "146 rows, null check, unique name audit" },
            { step: "02", title: "Cleaning", desc: "Tertiary capped at 100, 5 null life exp dropped" },
            { step: "03", title: "Derived Metrics", desc: "GDPpc, CO₂pc, log transformations computed" },
            { step: "04", title: "Univariate / Bi", desc: "Histograms, boxplots, OLS regression (r=0.83)" },
            { step: "05", title: "Outliers & Trade-offs", desc: "12.5t IQR fence, wealth–health residuals" },
            { step: "06", title: "Livability Index", desc: "Min-max normalization, rank shift analysis" },
          ].map((item) => (
            <div key={item.step} className="editorial-card p-4 relative">
              <span className="font-mono text-xs font-bold text-brand-teal block mb-1">
                {item.step}
              </span>
              <h4 className="font-serif text-sm font-bold text-brand-navy mb-1">
                {item.title}
              </h4>
              <p className="text-[11px] text-brand-textMuted leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Academic Project Credits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="editorial-card p-8 bg-brand-ivory/50 border border-brand-border">
          <div className="max-w-3xl">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-deepTeal block mb-1">
              Academic Submission & Course Information
            </span>
            <h3 className="font-serif text-2xl font-bold text-brand-navy mb-2">
              Exploratory Data Analysis (BACSE301)
            </h3>
            <p className="text-xs text-brand-textMuted leading-relaxed mb-6">
              Department of Computer Science & Engineering – Data Science, Academic Year 2026–27.
              Supervised under the Faculty of CSE – Data Science. This platform serves as the complete,
              reproducible interactive companion to the Zeroth Review and Final EDA Presentation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-brand-border/60 text-xs">
              <div>
                <p className="font-semibold text-brand-navy">Priyansh Asati</p>
                <p className="font-mono text-brand-textMuted text-[11px]">25BDS0268</p>
              </div>
              <div>
                <p className="font-semibold text-brand-navy">Medisetty Venkata Guru Sri Harsha</p>
                <p className="font-mono text-brand-textMuted text-[11px]">25BDS0284</p>
              </div>
              <div>
                <p className="font-semibold text-brand-navy">Nayani Balaji</p>
                <p className="font-mono text-brand-textMuted text-[11px]">25BDS0167</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
