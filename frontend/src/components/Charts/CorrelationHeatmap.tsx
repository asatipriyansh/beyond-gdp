"use client";

import React, { useState } from "react";

interface CorrelationHeatmapProps {
  variables: string[];
  labels: string[];
  matrix: (number | null)[][];
  methodName?: string;
}

export default function CorrelationHeatmap({
  variables,
  labels,
  matrix,
  methodName = "Pearson",
}: CorrelationHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    v1: string;
    v2: string;
    val: number;
    i: number;
    j: number;
  } | null>(null);

  // Diverging color:
  // -1.0 -> #E47D62 (Coral)
  //  0.0 -> #F5F7F4 (Neutral Light)
  // +1.0 -> #0D7377 (Deep Teal)
  const getCellColor = (val: number | null) => {
    if (val === null) return "#FFFFFF";
    if (val === 1.0) return "#102A36"; // diagonal

    if (val > 0) {
      // 0 to 1 -> light teal to deep teal
      const alpha = Math.min(Math.abs(val), 1);
      return `rgba(13, 115, 119, ${alpha * 0.85 + 0.1})`;
    } else {
      // -1 to 0 -> light coral to deep coral
      const alpha = Math.min(Math.abs(val), 1);
      return `rgba(228, 125, 98, ${alpha * 0.85 + 0.1})`;
    }
  };

  const getTextColor = (val: number | null) => {
    if (val === null) return "#172F3B";
    if (Math.abs(val) > 0.55 || val === 1.0) return "#FFFFFF";
    return "#172F3B";
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[620px] p-2">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-2 text-left font-semibold text-brand-navy border-b border-brand-border">
                {methodName} r
              </th>
              {labels.map((lbl, idx) => (
                <th
                  key={idx}
                  className="p-2 text-center font-semibold text-brand-navy border-b border-brand-border max-w-[80px] truncate"
                  title={lbl}
                >
                  <div className="transform -rotate-35 origin-bottom-left h-12 flex items-end">
                    {lbl}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {labels.map((rowLbl, i) => (
              <tr key={i}>
                <td className="p-2 font-medium text-brand-navy border-r border-brand-border bg-white/50 text-right pr-3 whitespace-nowrap">
                  {rowLbl}
                </td>
                {labels.map((colLbl, j) => {
                  const val = matrix[i][j];
                  const isHovered =
                    hoveredCell &&
                    hoveredCell.i === i &&
                    hoveredCell.j === j;

                  return (
                    <td
                      key={j}
                      onMouseEnter={() =>
                        val !== null &&
                        setHoveredCell({
                          v1: rowLbl,
                          v2: colLbl,
                          val,
                          i,
                          j,
                        })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`p-2 text-center font-mono transition-all duration-150 cursor-pointer border border-white/60 ${
                        isHovered ? "ring-2 ring-brand-navy scale-105 z-10" : ""
                      }`}
                      style={{
                        backgroundColor: getCellColor(val),
                        color: getTextColor(val),
                        fontWeight: Math.abs(val || 0) > 0.6 ? 600 : 400,
                      }}
                    >
                      {val !== null ? val.toFixed(2) : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-between text-xs text-brand-textMuted px-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-brand-navy">Scale:</span>
            <div className="flex items-center space-x-1">
              <span className="w-4 h-3 rounded" style={{ backgroundColor: "rgba(228, 125, 98, 0.9)" }} />
              <span>-1.0 (Inverse)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-4 h-3 rounded bg-[#F5F7F4] border border-brand-border" />
              <span>0.0 (None)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-4 h-3 rounded" style={{ backgroundColor: "rgba(13, 115, 119, 0.9)" }} />
              <span>+1.0 (Positive)</span>
            </div>
          </div>

          {hoveredCell && (
            <div className="bg-brand-navy text-white px-3 py-1.5 rounded text-xs shadow-md">
              <span className="text-brand-mint font-semibold">
                {hoveredCell.v1}
              </span>{" "}
              vs{" "}
              <span className="text-brand-mint font-semibold">
                {hoveredCell.v2}
              </span>
              : <span className="font-mono font-bold ml-1">{hoveredCell.val.toFixed(3)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
