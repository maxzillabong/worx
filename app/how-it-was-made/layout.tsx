import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Worx Was Made",
  description:
    "Learn how Worx was built 100% autonomously by Claude Code 4.6 with zero human code.",
  openGraph: {
    title: "How Worx Was Made | Worx",
    description:
      "Learn how Worx was built 100% autonomously by Claude Code 4.6 with zero human code.",
  },
};

export default function HowItWasMadeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return <>{children}</>;
}
