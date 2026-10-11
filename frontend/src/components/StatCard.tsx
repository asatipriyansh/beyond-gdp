import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  dimensionColor?: string;
  trend?: string;
  badge?: string;
}

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  dimensionColor,
  trend,
  badge,
}: StatCardProps) {
  return (
    <div className="editorial-card p-5 relative overflow-hidden flex flex-col justify-between">
      {dimensionColor && (
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: dimensionColor }}
        />
      )}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-brand-textMuted uppercase tracking-wider">
            {title}
          </p>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="font-serif text-2xl lg:text-3xl font-bold text-brand-navy">
              {value}
            </span>
            {badge && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-lightBg text-brand-teal border border-brand-border">
                {badge}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className="p-2.5 rounded-lg bg-brand-lightBg text-brand-deepTeal">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-3 pt-3 border-t border-brand-border/60 text-xs text-brand-textMuted flex items-center justify-between">
          <span>{subtext}</span>
          {trend && <span className="font-semibold text-brand-teal">{trend}</span>}
        </div>
      )}
    </div>
  );
}
