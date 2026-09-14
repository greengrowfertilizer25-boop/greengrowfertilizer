import type { Metadata } from 'next';
import { collectionFor } from '@/lib/server/resources';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const col = await collectionFor("crops");
    const { id } = await params;
    const crop = await col.findOne({ id });
    
    if (crop) {
      return {
        title: crop.name,
        description: crop.description || `Explore the best fertilizers and products for ${crop.name}.`,
        openGraph: {
          title: `${crop.name} | Greengrow Fertilizer`,
          description: crop.description || `Explore the best fertilizers and products for ${crop.name}.`,
          type: "website",
          images: crop.image ? [{ url: crop.image }] : undefined,
        },
        twitter: {
          card: "summary_large_image",
          title: crop.name,
          description: crop.description || `Explore the best fertilizers and products for ${crop.name}.`,
          images: crop.image ? [crop.image] : undefined,
        }
      };
    }
  } catch (err) {
    console.error("Error generating metadata for crop", err);
  }
  return { 
    title: "Crop Information | Greengrow Fertilizer",
    description: "Learn about the best practices and products for your crops."
  };
}

export default async function CropLayout({ children, params }: { children: React.ReactNode, params: Promise<{ id: string }> }) {
  return <>{children}</>;
}
