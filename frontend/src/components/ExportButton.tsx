"use client";

import React, { useState } from "react";
import { Download, Check } from "lucide-react";

interface ExportButtonProps {
  data: any[];
  filename: string;
  label?: string;
  format?: "csv" | "json";
}

export default function ExportButton({
  data,
  filename,
  label = "Export CSV",
  format = "csv",
}: ExportButtonProps) {
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = () => {
    if (!data || data.length === 0) return;

    let content = "";
    let mimeType = "text/csv;charset=utf-8;";

    if (format === "json") {
      content = JSON.stringify(data, null, 2);
      mimeType = "application/json;charset=utf-8;";
    } else {
      // CSV conversion
      const headers = Object.keys(data[0]);
      const csvRows = [headers.join(",")];

      data.forEach((row) => {
        const values = headers.map((header) => {
          const val = row[header];
          if (val === null || val === undefined) return "";
          if (typeof val === "string" && val.includes(",")) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        });
        csvRows.push(values.join(","));
      });
      content = csvRows.join("\n");
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}.${format === "json" ? "json" : "csv"}`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-white border border-brand-border text-xs font-medium text-brand-navy hover:bg-brand-lightBg hover:border-brand-teal transition shadow-sm"
      title={`Download ${format.toUpperCase()}`}
    >
      {downloaded ? (
        <>
          <Check className="w-3.5 h-3.5 text-brand-teal" />
          <span>Downloaded!</span>
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5 text-brand-textMuted" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
