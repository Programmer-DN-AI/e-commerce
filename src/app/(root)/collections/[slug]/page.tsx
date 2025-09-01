import Link from "next/link";
import { Card } from "@/components";
import { db } from "@/lib/db";
import { collections, productCollections, products, productImages, productVariants, brands, categories, genders } from "@/lib/db/schema";
import { eq, sql, and, desc } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Get collection details
  const collection = await db
    .select()
    .from(collections)
    .where(eq(collections.slug, slug))
    .limit(1);

  if (!collection.length) {
    notFound();
  }

  const collectionData = collection[0];

  // Get products in this collection
  const productsData = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      createdAt: products.createdAt,
      brandName: brands.name,
      categoryName: categories.name,
      genderLabel: genders.label,
      minPrice: sql<number | null>`min(${productVariants.price}::numeric)`,
      maxPrice: sql<number | null>`max(${productVariants.price}::numeric)`,
      imageUrl: sql<string | null>`max(case when ${productImages.isPrimary} = true then ${productImages.url} else null end)`,
    })
    .from(products)
    .innerJoin(productCollections, eq(products.id, productCollections.productId))
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .leftJoin(genders, eq(genders.id, products.genderId))
    .leftJoin(productVariants, eq(productVariants.productId, products.id))
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .where(and(
      eq(productCollections.collectionId, collectionData.id),
      eq(products.isPublished, true)
    ))
    .groupBy(products.id, products.name, products.description, products.createdAt, brands.name, categories.name, genders.label)
    .orderBy(desc(products.createdAt));

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <nav className="mb-6 text-caption text-dark-700">
          <Link href="/" className="hover:underline">Home</Link> /{" "}
          <Link href="/collections" className="hover:underline">Collections</Link> /{" "}
          <span className="text-dark-900">{collectionData.name}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-heading-1 text-dark-900 mb-2">{collectionData.name}</h1>
          <p className="text-body text-dark-700">
            {productsData.length} {productsData.length === 1 ? 'product' : 'products'} in this collection
          </p>
        </header>

        {productsData.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsData.map((product) => (
              <Card
                key={product.id}
                title={product.name}
                imageSrc={product.imageUrl || undefined}
                price={product.minPrice ? Number(product.minPrice) : undefined}
                href={`/products/${product.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-heading-2 text-dark-900 mb-4">No Products in Collection</h2>
            <p className="text-body text-dark-700 mb-6">
              This collection doesn't have any products yet.
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
