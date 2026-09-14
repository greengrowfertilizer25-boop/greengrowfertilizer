import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Greengrow Fertilizer, our farmer-first approach, and our mission to provide high-quality agrochemicals directly to farms.',
  openGraph: {
    title: 'About Us | Greengrow Fertilizer',
    description: 'Learn about Greengrow Fertilizer, our farmer-first approach, and our mission to provide high-quality agrochemicals directly to farms.',
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
