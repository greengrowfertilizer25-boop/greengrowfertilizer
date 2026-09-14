import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become a Dealer',
  description: 'Join the Greengrow Fertilizer dealer network. Grow your business with our premium range of agricultural products.',
  openGraph: {
    title: 'Become a Dealer | Greengrow Fertilizer',
    description: 'Join the Greengrow Fertilizer dealer network. Grow your business with our premium range of agricultural products.',
  }
};

export default function DealerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
