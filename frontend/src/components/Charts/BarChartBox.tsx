"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

interface BarChartBoxProps {
  data: Array<{ name: string; value?: number; [key: string]: any }>;
  dataKey?: string;
  keys?: Array<{ key: string; name: string; color: string }>;
  layout?: "horizontal" | "vertical";
  height?: number;
  barColor?: string;
  unit?: string;
  showGrid?: boolean;
}

export default function BarChartBox({
  data,
  dataKey = "value",
  keys,
  layout = "horizontal",
  height = 360,
  barColor = "#159A91",
  unit = "",
  showGrid = true,
}: BarChartBoxProps) {
  const isVertical = layout === "vertical";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <p className="font-bold text-brand-mint text-xs">{label}</p>
          <div className="mt-1 space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-xs text-gray-200">
                <span style={{ color: entry.color }}>●</span> {entry.name}:{" "}
                <span className="font-mono text-white font-semibold">
                  {typeof entry.value === "number"
                    ? entry.value.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })
                    : entry.value}{" "}
                  {unit}
                </span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={layout}
          margin={{ top: 15, right: 30, left: isVertical ? 60 : 10, bottom: 25 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#DCE5E2" strokeOpacity={0.7} />
          )}
          {isVertical ? (
            <>
              <XAxis
                type="number"
                stroke="#172F3B"
                tick={{ fontSize: 11, fill: "#526570" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#172F3B"
                tick={{ fontSize: 11, fill: "#172F3B" }}
                width={80}
              />
            </>
          ) : (
            <>
              <XAxis
                type="category"
                dataKey="name"
                stroke="#172F3B"
                tick={{ fontSize: 11, fill: "#526570" }}
                angle={data.length > 8 ? -35 : 0}
                textAnchor={data.length > 8 ? "end" : "middle"}
                height={data.length > 8 ? 60 : 30}
              />
              <YAxis
                type="number"
                stroke="#172F3B"
                tick={{ fontSize: 11, fill: "#526570" }}
              />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          {keys && keys.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {keys && keys.length > 0 ? (
            keys.map((k) => (
              <Bar
                key={k.key}
                dataKey={k.key}
                name={k.name}
                fill={k.color}
                radius={isVertical ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              />
            ))
          ) : (
            <Bar
              dataKey={dataKey}
              name="Value"
              fill={barColor}
              radius={isVertical ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
