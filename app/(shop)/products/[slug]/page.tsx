import { getProductBySlug } from "@/services/product";
import ProductGallery from "@/components/ProductGallery";
import ProductOptions from "@/components/ProductOptions";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const productDetail = await getProductBySlug(slug);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-16 md:grid-cols-2">
        {/* Images */}
        <ProductGallery images={productDetail.images} />

        {/* Info */}
        <ProductOptions product={productDetail} />
      </div>
    </main>
  );
}
