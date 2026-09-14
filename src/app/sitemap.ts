import { MetadataRoute } from "next";
import { collectionFor } from "@/lib/server/resources";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://greengrowfertilizer.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dealer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const productsCollection = await collectionFor("products");
    const products = await productsCollection.find({ status: "Active" }).toArray();
    
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: new Date(product._updatedAt || new Date()),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    const blogsCollection = await collectionFor("blogs");
    const blogs = await blogsCollection.find({}).toArray();
    
    const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug || blog.id}`,
      lastModified: new Date(blog._updatedAt || new Date()),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const cropsCollection = await collectionFor("crops");
    const crops = await cropsCollection.find({}).toArray();
    
    const cropRoutes: MetadataRoute.Sitemap = crops.map((crop) => ({
      url: `${baseUrl}/crops/${crop.id}`,
      lastModified: new Date(crop._updatedAt || new Date()),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes, ...blogRoutes, ...cropRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}
