import Link from "next/link";
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
          {collectionsData.map((collection) => (
            <div
              key={collection.id}
              className="group relative overflow-hidden rounded-xl border border-light-300 bg-light-100 transition-all hover:shadow-lg"
            >
              <div className="aspect-square bg-gradient-to-br from-light-200 to-light-300 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-heading-3 text-dark-900 mb-2">{collection.name}</h3>
                  <p className="text-body text-dark-700">
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
          ))}
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
