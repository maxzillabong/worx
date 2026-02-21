import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Was Made — Worx',
  description: 'Learn how Worx was built autonomously by Claude Code 4.6 as a test of AI-assisted development.',
  openGraph: {
    title: 'How It Was Made — Worx',
    description: 'Built autonomously by Claude Code 4.6 as a test of AI-assisted development.',
  },
};

export default function HowItWasMadeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return <>{children}</>;
}
