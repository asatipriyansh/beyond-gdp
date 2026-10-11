"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Globe, ArrowUpDown, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import DimensionBadge from "@/components/DimensionBadge";
import ExportButton from "@/components/ExportButton";

export default function CountriesDirectoryPage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "gdp" | "life_exp" | "co2" | "rank">("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [datasetFilter, setDatasetFilter] = useState<"all" | "clean" | "index" | "excluded">("all");

  useEffect(() => {
    fetch("/data/countries.json")
      .then((r) => r.json())
      .then((data) => {
        setCountries(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSort = (field: "name" | "gdp" | "life_exp" | "co2" | "rank") => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(field === "name");
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = countries.filter((c) => {
      // Search
      if (search && !c.country.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // Dataset status
      if (datasetFilter === "clean" && !c.in_clean_dataset) return false;
      if (datasetFilter === "index" && !c.in_index_dataset) return false;
      if (datasetFilter === "excluded" && c.in_clean_dataset) return false;

      return true;
    });

    result.sort((a, b) => {
      let valA: any = 0;
      let valB: any = 0;

      if (sortBy === "name") {
        valA = a.country;
        valB = b.country;
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (sortBy === "gdp") {
        valA = a.clean ? a.clean.gdp_pc : -1;
        valB = b.clean ? b.clean.gdp_pc : -1;
      } else if (sortBy === "life_exp") {
        valA = a.clean ? a.clean.life_exp : -1;
        valB = b.clean ? b.clean.life_exp : -1;
      } else if (sortBy === "co2") {
        valA = a.clean && a.clean.co2_pc !== null ? a.clean.co2_pc : -1;
        valB = b.clean && b.clean.co2_pc !== null ? b.clean.co2_pc : -1;
      } else if (sortBy === "rank") {
        valA = a.index ? a.index.index_rank : 999;
        valB = b.index ? b.index.index_rank : 999;
      }

      return sortAsc ? valA - valB : valB - valA;
    });

    return result;
  }, [countries, search, sortBy, sortAsc, datasetFilter]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-brand-navy">Loading Directory...</p>
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
              National Index Directory
            </span>
            <span className="text-xs text-brand-textMuted">• 146 Countries Registered</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mt-1">
            Country Directory & Profiles
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted mt-1">
            Alphabetical census running from Afghanistan to Saint Vincent. Click any country to open its dedicated analytical profile.
          </p>
        </div>

        <ExportButton
          data={filteredAndSorted.map((c) => ({
            Country: c.country,
            In_Clean_Dataset: c.in_clean_dataset,
            In_Index_Dataset: c.in_index_dataset,
            GDP_per_capita: c.clean ? c.clean.gdp_pc : null,
            Life_Expectancy: c.clean ? c.clean.life_exp : null,
            CO2_per_capita: c.clean ? c.clean.co2_pc : null,
            Livability_Rank: c.index ? c.index.index_rank : null,
          }))}
          filename="beyond_gdp_directory"
          label="Export Directory CSV"
        />
      </div>

      {/* Search and Filters */}
      <div className="editorial-card p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by country name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-brand-border bg-brand-lightBg focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto text-xs">
          {[
            { id: "all", label: "All 146 Countries" },
            { id: "clean", label: "Clean Set (141)" },
            { id: "index", label: "Index Set (131)" },
            { id: "excluded", label: "Excluded (5)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDatasetFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap ${
                datasetFilter === tab.id
                  ? "bg-brand-navy text-white shadow-sm"
                  : "bg-brand-lightBg text-brand-textMuted hover:text-brand-navy border border-brand-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="editorial-card p-5 overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border text-brand-textMuted font-semibold">
              <th
                onClick={() => handleSort("name")}
                className="py-2.5 pr-4 cursor-pointer hover:text-brand-navy"
              >
                <div className="flex items-center space-x-1">
                  <span>Country</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3">Status</th>
              <th
                onClick={() => handleSort("gdp")}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-brand-navy"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>GDP pc (US$)</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort("life_exp")}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-brand-navy"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Life Exp</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort("co2")}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-brand-navy"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>CO₂ pc (t)</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort("rank")}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-brand-navy"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Index Rank</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-right">Rank Shift</th>
              <th className="py-2.5 pl-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/60">
            {filteredAndSorted.map((c) => (
              <tr key={c.country} className="hover:bg-brand-lightBg/50 transition">
                <td className="py-3 pr-4 font-semibold text-brand-navy">
                  <Link
                    href={`/countries/${encodeURIComponent(c.country)}`}
                    className="hover:text-brand-teal transition flex items-center space-x-1.5"
                  >
                    <span>{c.country}</span>
                  </Link>
                </td>
                <td className="py-3 px-3">
                  {c.in_index_dataset ? (
                    <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Full Index</span>
                    </span>
                  ) : c.in_clean_dataset ? (
                    <span className="inline-flex items-center space-x-1 text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      <span>Clean (Partial)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <AlertCircle className="w-3 h-3" />
                      <span>Dropped (Null LE)</span>
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {c.clean ? `$${Math.round(c.clean.gdp_pc).toLocaleString()}` : "Not available"}
                </td>
                <td className="py-3 px-3 text-right font-mono font-medium text-brand-teal">
                  {c.clean ? `${c.clean.life_exp.toFixed(1)} yrs` : "Not available"}
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {c.clean && c.clean.co2_pc !== null ? `${c.clean.co2_pc.toFixed(2)} t` : "Not available"}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-brand-navy">
                  {c.index ? `#${c.index.index_rank}` : "—"}
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {c.index ? (
                    <span
                      className={`font-semibold ${
                        c.index.rank_shift > 0
                          ? "text-emerald-600"
                          : c.index.rank_shift < 0
                          ? "text-rose-600"
                          : "text-gray-500"
                      }`}
                    >
                      {c.index.rank_shift > 0 ? "+" : ""}
                      {c.index.rank_shift}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-3 pl-4 text-right">
                  <Link
                    href={`/countries/${encodeURIComponent(c.country)}`}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-deepTeal hover:underline"
                  >
                    <span>Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSorted.length === 0 && (
          <div className="py-12 text-center text-xs text-brand-textMuted">
            No countries found matching your search. Try resetting filters.
          </div>
        )}
      </div>
    </div>
  );
}
