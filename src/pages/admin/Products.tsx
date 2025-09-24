import { useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  fetchProducts as fetchProductsPaged,
  Product,
  updateProduct,
} from "@/lib/queries";

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
    </div>
  );
};

export default AdminProducts;
