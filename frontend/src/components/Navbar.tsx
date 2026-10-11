"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Compass, BarChart3, Globe, Sparkles, Scale, AlertCircle, Database, BookOpen, Layers } from "lucide-react";

const navLinks = [
  { href: "/", label: "Overview", icon: Sparkles },
  { href: "/explore", label: "EDA Dashboard", icon: BarChart3 },
  { href: "/compare", label: "Comparison Studio", icon: Scale },
  { href: "/countries", label: "Countries", icon: Globe },
  { href: "/relationships", label: "Relationships", icon: Compass },
  { href: "/environment", label: "Trade-offs", icon: Layers },
  { href: "/outliers", label: "Outliers", icon: AlertCircle },
  { href: "/livability-index", label: "Livability Index", icon: Sparkles },
  { href: "/methodology", label: "Methodology", icon: BookOpen },
  { href: "/data-sources", label: "Sources", icon: Database },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-navy border-b border-brand-teal/20 backdrop-blur shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded bg-brand-teal/20 border border-brand-teal/40 flex items-center justify-center text-brand-mint font-serif font-bold text-lg group-hover:bg-brand-teal/30 transition">
              β
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-lg font-bold tracking-tight text-white group-hover:text-brand-mint transition">
                  Beyond GDP
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-brand-teal/20 text-brand-mint border border-brand-teal/30">
                  EDA 2026–27
                </span>
              </div>
              <p className="text-[11px] text-brand-mint/70 font-sans tracking-wide">
                CSE – Data Science
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? "bg-brand-teal text-white shadow-sm"
                      : "text-gray-300 hover:text-white hover:bg-brand-darkSurface"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-brand-darkSurface focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-brand-darkSurface border-b border-brand-border/20 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-brand-teal text-white"
                    : "text-gray-300 hover:text-white hover:bg-brand-navy"
                }`}
              >
                <Icon className="w-4 h-4 text-brand-mint" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
