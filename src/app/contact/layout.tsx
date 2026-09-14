import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Greengrow Fertilizer. Reach out for any product inquiries, support, or partnership opportunities.',
  openGraph: {
    title: 'Contact Us | Greengrow Fertilizer',
    description: 'Get in touch with Greengrow Fertilizer. Reach out for any product inquiries, support, or partnership opportunities.',
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
