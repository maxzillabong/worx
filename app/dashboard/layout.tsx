import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — Worx Blood Analysis',
  description: 'View your bloodwork results with AI-powered insights, trend analysis, and health recommendations.',
  openGraph: {
    title: 'Dashboard — Worx Blood Analysis',
    description: 'View your bloodwork results with AI-powered insights and recommendations.',
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return <>{children}</>;
}
