import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse Greengrow Fertilizer products by category. Find exactly what your crops need.',
  openGraph: {
    title: 'Product Categories | Greengrow Fertilizer',
    description: 'Browse Greengrow Fertilizer products by category. Find exactly what your crops need.',
  }
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
