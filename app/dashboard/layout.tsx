import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blood Analysis Report",
  description:
    "View your AI-powered blood analysis results with detailed metric breakdowns and health insights.",
  openGraph: {
    title: "Blood Analysis Report | Worx",
    description:
      "View your AI-powered blood analysis results with detailed metric breakdowns and health insights.",
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return <>{children}</>;
}
