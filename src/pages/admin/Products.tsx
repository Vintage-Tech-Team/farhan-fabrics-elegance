import { useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  fetchProducts as fetchProductsPaged,
  Product,
  updateProduct,
} from "@/lib/queries";
import ProductImagesModal from "@/components/ProductImagesModal";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { useEffect as useEffect2, useState as useState2 } from "react";
import { fetchProductImages } from "@/lib/queries";

const AdminProducts = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const [form, setForm] = useState<{
    id?: number;
    name: string;
    price: number;
    stock: number | null;
  }>({ name: "", price: 0, stock: 0 });
  const editing = Boolean(form.id);
  const [imagesFor, setImagesFor] = useState<number | null>(null);
  const cld = new Cloudinary({
    cloud: { cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME },
  });
  const [primaryMap, setPrimaryMap] = useState2<Record<number, string | null>>(
    {}
  );

  useEffect2(() => {
    // Load primary images for first page items
    const run = async () => {
      const entries = await Promise.all(
        items.map(async (p) => {
          const imgs = await fetchProductImages(p.id);
          const primary = imgs.find((i) => i.is_primary) || imgs[0];
          return [p.id, primary ? primary.image_url : null] as const;
        })
      );
      const map: Record<number, string | null> = {};
      for (const [id, publicId] of entries) map[id] = publicId;
      setPrimaryMap(map);
    };
    if (items.length) run();
  }, [items]);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, total } = await fetchProductsPaged({
      page: 1,
      pageSize: 100,
    });
    if (!data) {
      setItems([]);
    } else {
      setItems(data);
    }
    if (total === undefined) {
      // noop
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing && form.id) {
        await updateProduct(form.id, {
          name: form.name,
          price: form.price,
          stock: form.stock ?? 0,
        });
      } else {
        await createProduct({
          name: form.name,
          price: form.price,
          stock: form.stock ?? 0,
        });
      }
      setForm({ name: "", price: 0, stock: 0 });
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to save");
    }
  };

  const onEdit = (p: Product) =>
    setForm({ id: p.id, name: p.name, price: p.price, stock: p.stock ?? 0 });
  const onDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to delete");
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Products</h1>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="mb-6 rounded border p-4">
        <h2 className="mb-2 font-semibold">
          {editing ? "Edit" : "Create"} Product
        </h2>
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 gap-3 md:grid-cols-5"
        >
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Name</label>
            <input
              className="rounded border px-3 py-2"
              placeholder="e.g. Lawn Suit"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Price (PKR)</label>
            <input
              className="rounded border px-3 py-2"
              placeholder="e.g. 1999"
              type="number"
              step="0.01"
              min={0}
              value={form.price}
              onChange={(e) =>
                setForm((s) => ({ ...s, price: Number(e.target.value) }))
              }
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Stock</label>
            <input
              className="rounded border px-3 py-2"
              placeholder="e.g. 25"
              type="number"
              min={0}
              value={form.stock ?? 0}
              onChange={(e) =>
                setForm((s) => ({ ...s, stock: Number(e.target.value) }))
              }
            />
          </div>
          <div className="md:col-span-5 flex gap-2">
            <button
              type="submit"
              className="rounded bg-gray-900 px-4 py-2 text-white"
            >
              {editing ? "Update" : "Create"}
            </button>
            {editing && (
              <button
                type="button"
                className="rounded px-4 py-2"
                onClick={() => setForm({ name: "", price: 0, stock: 0 })}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <input
          className="rounded border px-3 py-2"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="rounded border px-3 py-2" onClick={load}>
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">
                    {primaryMap[p.id]
                      ? (() => {
                          const img = cld
                            .image(primaryMap[p.id] as string)
                            .format("auto")
                            .quality("auto")
                            .resize(
                              auto().gravity(autoGravity()).width(60).height(60)
                            );
                          return <AdvancedImage cldImg={img} />;
                        })()
                      : null}
                    <div>
                      <button
                        className="mt-1 rounded border px-2 py-1 text-xs"
                        onClick={() => setImagesFor(p.id)}
                      >
                        Images
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2">Rs {p.price}</td>
                  <td className="px-4 py-2">{p.stock ?? 0}</td>
                  <td className="px-4 py-2">
                    {p.created_at
                      ? new Date(p.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        className="rounded border px-3 py-1"
                        onClick={() => onEdit(p)}
                      >
                        Edit
                      </button>
                      <a
                        className="rounded border px-3 py-1"
                        href={`/admin/products/${p.id}`}
                      >
                        Details
                      </a>
                      <button
                        className="rounded border px-3 py-1 text-red-600"
                        onClick={() => onDelete(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductImagesModal
        productId={imagesFor ?? 0}
        isOpen={imagesFor !== null}
        onClose={() => setImagesFor(null)}
      />
    </div>
  );
};

export default AdminProducts;
