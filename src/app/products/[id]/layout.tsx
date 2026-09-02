import type { Metadata } from 'next';
import { collectionFor } from '@/lib/server/resources';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const col = await collectionFor("products");
    const { id } = await params;
    const product = await col.findOne({ id });
    
    if (product) {
      return {
        title: product.name,
        description: product.description || `Buy ${product.name} from Greengrow Fertilizer. ${product.tagline || ''}`,
        openGraph: {
          title: product.name,
          description: product.description || `Buy ${product.name} from Greengrow Fertilizer. ${product.tagline || ''}`,
          type: "website",
          images: product.images && product.images.length > 0 ? [{ url: product.images[0] }] : undefined,
        },
        twitter: {
          card: "summary_large_image",
          title: product.name,
          description: product.description || `Buy ${product.name} from Greengrow Fertilizer.`,
          images: product.images && product.images.length > 0 ? [product.images[0]] : undefined,
        }
      };
    }
  } catch (err) {
    console.error("Error generating metadata for product", err);
  }
  return { 
    title: "Product | Greengrow Fertilizer",
    description: "View our agricultural products."
  };
}

export default async function ProductLayout({ children, params }: { children: React.ReactNode, params: Promise<{ id: string }> }) {
  let jsonLd = null;
  try {
    const { id } = await params;
    const col = await collectionFor("products");
    const product = await col.findOne({ id });
    if (product) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.images || undefined,
        "description": product.description || product.tagline,
        "brand": {
          "@type": "Brand",
          "name": "Greengrow Fertilizer"
        },
        "category": product.categoryId,
        "offers": {
          "@type": "Offer",
          "url": `${process.env.NEXT_PUBLIC_BASE_URL || "https://greengrowfertilizer.com"}/products/${product.id}`,
          "priceCurrency": "INR",
          "price": product.pricing?.mrp || "0",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Greengrow Fertilizer"
          }
        }
      };
    }
  } catch (e) {
    // Ignore error
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
