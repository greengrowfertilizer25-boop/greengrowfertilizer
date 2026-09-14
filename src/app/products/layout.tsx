import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Explore our wide range of premium fertilizers, insecticides, fungicides, and plant growth regulators.',
  openGraph: {
    title: 'Our Products | Greengrow Fertilizer',
    description: 'Explore our wide range of premium fertilizers, insecticides, fungicides, and plant growth regulators.',
  }
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
