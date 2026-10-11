import React from "react";

export type DimensionType = "Economic" | "Health" | "Social" | "Environmental" | "Composite";

interface DimensionBadgeProps {
  dimension: DimensionType;
  size?: "sm" | "md" | "lg";
}

const colorMap: Record<DimensionType, { bg: string; text: string; border: string }> = {
  Economic: {
    bg: "bg-[#4777A8]/10",
    text: "text-[#4777A8]",
    border: "border-[#4777A8]/30",
  },
  Health: {
    bg: "bg-[#159A91]/10",
    text: "text-[#159A91]",
    border: "border-[#159A91]/30",
  },
  Social: {
    bg: "bg-[#D9A441]/10",
    text: "text-[#D9A441]",
    border: "border-[#D9A441]/30",
  },
  Environmental: {
    bg: "bg-[#6B9D78]/10",
    text: "text-[#6B9D78]",
    border: "border-[#6B9D78]/30",
  },
  Composite: {
    bg: "bg-brand-navy/10",
    text: "text-brand-navy",
    border: "border-brand-navy/20",
  },
};

export default function DimensionBadge({ dimension, size = "md" }: DimensionBadgeProps) {
  const styles = colorMap[dimension] || colorMap.Composite;

  const sizeStyles = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5 font-medium",
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${styles.bg} ${styles.text} ${styles.border} ${sizeStyles}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5"
        style={{
          backgroundColor:
            dimension === "Economic"
              ? "#4777A8"
              : dimension === "Health"
              ? "#159A91"
              : dimension === "Social"
              ? "#D9A441"
              : dimension === "Environmental"
              ? "#6B9D78"
              : "#102A36",
        }}
      />
      {dimension}
    </span>
  );
}
