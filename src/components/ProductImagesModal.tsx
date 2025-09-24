import { useEffect, useMemo, useState } from "react";
import {
  addProductImage,
  deleteProductImage,
  fetchProductImages,
  setPrimaryProductImage,
  ProductImage,
} from "@/lib/queries";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

type Props = {
  productId: number;
  isOpen: boolean;
  onClose: () => void;
};

const cld = new Cloudinary({
  cloud: { cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME },
});

export default function ProductImagesModal({
  productId,
  isOpen,
  onClose,
}: Props) {
  const [items, setItems] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductImages(productId);
      setItems(data);
    } catch (e: any) {
      setError(e.message || "Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string
      );
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/upload`,
        { method: "POST", body: form }
      );
      const data = await res.json();
      if (!data.public_id) throw new Error("Upload failed");
      await addProductImage(productId, data.public_id, items.length === 0);
      await load();
      e.target.value = "";
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const onSetPrimary = async (imageId: number) => {
    setLoading(true);
    try {
      await setPrimaryProductImage(productId, imageId);
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to set primary");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (imageId: number) => {
    if (!confirm("Delete this image? This won't remove it from Cloudinary."))
      return;
    setLoading(true);
    try {
      await deleteProductImage(imageId);
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to delete image");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded bg-white p-4 shadow">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Product Images</h2>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <div className="mb-4 flex items-center gap-3">
          <input type="file" accept="image/*" onChange={onUpload} />
          {loading && <span className="text-sm text-gray-600">Working…</span>}
        </div>

        {items.length === 0 ? (
          <p className="text-gray-600">No images yet. Upload one above.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {items.map((img) => {
              const cldImg = cld
                .image(img.image_url)
                .format("auto")
                .quality("auto")
                .resize(auto().gravity(autoGravity()).width(300).height(300));
              return (
                <div key={img.id} className="rounded border p-2">
                  <AdvancedImage cldImg={cldImg} />
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="truncate">
                      {img.is_primary ? (
                        <span className="rounded bg-green-100 px-2 py-0.5 text-green-700">
                          Primary
                        </span>
                      ) : (
                        ""
                      )}
                    </span>
                    <div className="flex gap-2">
                      {!img.is_primary && (
                        <button
                          className="rounded border px-2 py-1"
                          onClick={() => onSetPrimary(img.id)}
                        >
                          Set primary
                        </button>
                      )}
                      <button
                        className="rounded border px-2 py-1 text-red-600"
                        onClick={() => onDelete(img.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
