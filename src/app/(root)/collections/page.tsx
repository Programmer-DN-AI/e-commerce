import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { collections, productCollections } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export default async function CollectionsPage() {
  // Get all collections with their product counts
  const collectionsData = await db
    .select({
      id: collections.id,
      name: collections.name,
      slug: collections.slug,
      productCount: sql<number>`count(distinct ${productCollections.productId})`.as("productCount"),
    })
    .from(collections)
    .leftJoin(productCollections, eq(collections.id, productCollections.collectionId))
    .groupBy(collections.id, collections.name, collections.slug)
    .orderBy(collections.name);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <h1 className="text-heading-1 text-dark-900 mb-2">Collections</h1>
        <p className="text-body text-dark-700 mb-8">
          Discover our curated collections of premium footwear and accessories.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collectionsData.map((collection, index) => {
            // Define collection images based on collection name or use default images
            const getCollectionImage = (name: string) => {
              const lowerName = name.toLowerCase();
              if (lowerName.includes('running') || lowerName.includes('athletic')) {
                return '/shoes/shoe-1.jpg';
              } else if (lowerName.includes('casual') || lowerName.includes('lifestyle')) {
                return '/shoes/shoe-2.webp';
              } else if (lowerName.includes('basketball') || lowerName.includes('sport')) {
                return '/shoes/shoe-3.webp';
              } else if (lowerName.includes('training') || lowerName.includes('fitness')) {
                return '/shoes/shoe-4.webp';
              } else {
                // Use different shoe images for variety
                const shoeImages = [
                  '/shoes/shoe-1.jpg',
                  '/shoes/shoe-2.webp',
                  '/shoes/shoe-3.webp',
                  '/shoes/shoe-4.webp',
                  '/shoes/shoe-5.avif',
                  '/shoes/shoe-6.avif',
                  '/shoes/shoe-7.avif',
                  '/shoes/shoe-8.avif',
                  '/shoes/shoe-9.avif',
                  '/shoes/shoe-10.avif',
                  '/shoes/shoe-11.avif',
                  '/shoes/shoe-12.avif',
                  '/shoes/shoe-13.avif',
                  '/shoes/shoe-14.avif',
                  '/shoes/shoe-15.avif'
                ];
                return shoeImages[index % shoeImages.length];
              }
            };

            return (
              <div
                key={collection.id}
                className="group relative overflow-hidden rounded-xl border border-light-300 bg-light-100 transition-all hover:shadow-lg hover:scale-105"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={getCollectionImage(collection.name)}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Collection info overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <h3 className="text-heading-2 text-light-100 mb-2 font-bold drop-shadow-lg">
                      {collection.name}
                    </h3>
                    <p className="text-body-medium text-light-100 drop-shadow-lg">
                      {collection.productCount} {collection.productCount === 1 ? "product" : "products"}
                    </p>
                  </div>
                </div>
                
                <div className="p-4">
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="inline-flex items-center justify-center w-full rounded-full bg-dark-900 px-6 py-3 text-body-medium text-light-100 transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
                  >
                    View Collection
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {collectionsData.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-heading-2 text-dark-900 mb-4">No Collections Available</h2>
            <p className="text-body text-dark-700 mb-6">
            Collections will appear here once they&apos;re added to the database.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-dark-900 px-6 py-3 text-body-medium text-light-100 transition hover:opacity-90"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
