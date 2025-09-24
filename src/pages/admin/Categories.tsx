import { useEffect, useMemo, useState } from "react";
import {
  Category,
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "@/lib/queries";

const AdminCategories = () => {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      items.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const [form, setForm] = useState<{ id?: number; name: string; slug: string }>(
    { name: "", slug: "" }
  );
  const editing = Boolean(form.id);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategories();
      setItems(data);
    } catch (e: any) {
      setError(e.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing && form.id) {
        await updateCategory(form.id, { name: form.name, slug: form.slug });
      } else {
        await createCategory({ name: form.name, slug: form.slug });
      }
      setForm({ name: "", slug: "" });
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to save");
    }
  };

  const onEdit = (cat: Category) =>
    setForm({ id: cat.id as number, name: cat.name, slug: cat.slug ?? "" });
  const onDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to delete");
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Categories</h1>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <div className="mb-6 rounded border p-4">
        <h2 className="mb-2 font-semibold">
          {editing ? "Edit" : "Create"} Category
        </h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Name</label>
            <input
              className="rounded border px-3 py-2"
              placeholder="e.g. Cotton"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Slug</label>
            <input
              className="rounded border px-3 py-2"
              placeholder="e.g. cotton"
              value={form.slug}
              onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-4 flex gap-2">
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
                onClick={() => setForm({ name: "", slug: "" })}
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
                <th className="px-4 py-2">Slug</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.slug}</td>
                  <td className="px-4 py-2">
                    {c.created_at
                      ? new Date(c.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        className="rounded border px-3 py-1"
                        onClick={() => onEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded border px-3 py-1 text-red-600"
                        onClick={() => onDelete(c.id)}
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

export default AdminCategories;
