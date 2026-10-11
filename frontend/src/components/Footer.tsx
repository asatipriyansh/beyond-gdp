import Link from "next/link";
import { Download, ExternalLink, GraduationCap, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-navy border-t border-brand-teal/20 text-gray-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Project Identity */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-brand-teal/20 border border-brand-teal/40 flex items-center justify-center text-brand-mint font-serif font-bold text-sm">
                β
              </div>
              <span className="font-serif text-lg font-bold text-white">Beyond GDP</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Exploratory Data Analysis investigating whether economic prosperity is sufficient to make a country livable across Health, Social, and Environmental dimensions.
            </p>
            <div className="pt-2 text-[11px] text-brand-mint flex items-center space-x-1">
              <GraduationCap className="w-4 h-4" />
              <span>BACSE301 • CSE – Data Science (2026–27)</span>
            </div>
          </div>

          {/* Column 2: Research Team */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white tracking-wide uppercase mb-3 flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-brand-mint" />
              <span>Research Team</span>
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex flex-col">
                <span className="font-medium text-white">Priyansh Asati</span>
                <span className="text-[11px] text-gray-400 font-mono">25BDS0268</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium text-white">Medisetty Venkata Guru Sri Harsha</span>
                <span className="text-[11px] text-gray-400 font-mono">25BDS0284</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium text-white">Nayani Balaji</span>
                <span className="text-[11px] text-gray-400 font-mono">25BDS0167</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Analytical Framework */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white tracking-wide uppercase mb-3">
              Analytical Modules
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li>
                <Link href="/explore" className="hover:text-brand-mint transition">
                  Exploratory Data Dashboard
                </Link>
              </li>
              <li>
                <Link href="/relationships" className="hover:text-brand-mint transition">
                  Correlation & Regression Engine
                </Link>
              </li>
              <li>
                <Link href="/environment" className="hover:text-brand-mint transition">
                  Economic–Environmental Trade-offs
                </Link>
              </li>
              <li>
                <Link href="/outliers" className="hover:text-brand-mint transition">
                  IQR Outliers & Health Residuals
                </Link>
              </li>
              <li>
                <Link href="/livability-index" className="hover:text-brand-mint transition">
                  Exploratory Livability Index
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-brand-mint transition">
                  Methodology & Data Cleaning
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Verified Data Provenance & Downloads */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white tracking-wide uppercase mb-3">
              Data & Artifacts
            </h4>
            <p className="text-xs text-gray-400 mb-3">
              146-country dataset compiled from World Bank WDI and Global Country Information 2023.
            </p>
            <div className="space-y-2">
              <a
                href="/data/clean.csv"
                download="beyond_gdp_clean_141.csv"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-brand-darkSurface border border-brand-teal/40 text-brand-mint text-xs hover:bg-brand-teal/20 transition w-full"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Clean Dataset CSV (141 countries)</span>
              </a>
              <a
                href="/data/index.csv"
                download="beyond_gdp_index_131.csv"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-brand-darkSurface border border-brand-teal/40 text-brand-mint text-xs hover:bg-brand-teal/20 transition w-full"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Livability Index CSV (131 countries)</span>
              </a>
              <Link
                href="/data-sources"
                className="inline-flex items-center space-x-1 text-xs text-gray-400 hover:text-white pt-1"
              >
                <span>View all verified sources</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-brand-darkSurface flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500">
          <div>
            Beyond GDP Academic Project © 2026–27. Department of Computer Science & Engineering – Data Science.
          </div>
          <div className="mt-2 sm:mt-0 italic">
            For academic exploratory analysis purposes only. Not an official national policy index.
          </div>
        </div>
      </div>
    </footer>
  );
}
