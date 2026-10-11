import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Beyond GDP: What Really Makes a Country Livable? | Exploratory Data Analysis",
  description:
    "An exploratory data analysis of economic, health, social, and environmental indicators across 146 countries. BACSE301, CSE – Data Science (2026–27).",
  keywords: [
    "Beyond GDP",
    "Exploratory Data Analysis",
    "Livability Index",
    "World Bank WDI",
    "Health and Prosperity",
    "CO2 Trade-offs",
    "CSE Data Science",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-brand-lightBg text-brand-text font-sans antialiased selection:bg-brand-teal selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
