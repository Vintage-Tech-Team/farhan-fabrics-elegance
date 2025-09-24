import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/lib/queries";
import ProductImagesModal from "@/components/ProductImagesModal";

const ProductDetails = () => {
  const { id } = useParams();
  const productId = Number(id);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagesOpen, setImagesOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(
          "id,name,description,price,discount_price,stock,category_id,section_id,fabric_id,gender,season,created_at"
        )
        .eq("id", productId)
        .single();
      if (error) setError(error.message);
      setProduct((data as Product) || null);
    };
    if (!Number.isNaN(productId)) load();
  }, [productId]);

  if (Number.isNaN(productId)) return <div>Invalid product id</div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Product Details</h1>
        <Link to="/admin/products" className="rounded border px-3 py-1">
          Back
        </Link>
      </div>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {!product ? (
        <p className="text-gray-600">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded border p-4">
            <div className="mb-2 text-sm text-gray-600">Name</div>
            <div className="text-lg font-medium">{product.name}</div>
            <div className="mt-3 text-sm text-gray-600">Price</div>
            <div>Rs {product.price}</div>
            <div className="mt-3 text-sm text-gray-600">Stock</div>
            <div>{product.stock ?? 0}</div>
            <div className="mt-3 text-sm text-gray-600">Created</div>
            <div>
              {product.created_at
                ? new Date(product.created_at).toLocaleString()
                : "-"}
            </div>
          </div>
          <div className="rounded border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-lg font-semibold">Images</div>
              <button
                className="rounded border px-3 py-1"
                onClick={() => setImagesOpen(true)}
              >
                Manage
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Use Manage to upload, set primary, or delete images.
            </p>
          </div>
        </div>
      )}

      <ProductImagesModal
        productId={productId}
        isOpen={imagesOpen}
        onClose={() => setImagesOpen(false)}
      />
    </div>
  );
};

export default ProductDetails;
