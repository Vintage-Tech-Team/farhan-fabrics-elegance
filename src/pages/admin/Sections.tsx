import { useEffect, useMemo, useState } from "react";
import {
  fetchSections,
  createSection,
  updateSection,
  deleteSection,
  Section,
} from "@/lib/queries";

const AdminSections = () => {
  const [items, setItems] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      items.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const [form, setForm] = useState<{
    id?: number;
    name: string;
    slug: string;
    category_id: number | null;
  }>({ name: "", slug: "", category_id: null });
  const editing = Boolean(form.id);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSections();
      setItems(data);
    } catch (e: any) {
      setError(e.message || "Failed to load sections");
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
        await updateSection(form.id, {
          name: form.name,
          slug: form.slug,
          category_id: form.category_id,
        });
      } else {
        await createSection({
          name: form.name,
          slug: form.slug,
          category_id: form.category_id,
        });
      }
      setForm({ name: "", slug: "", category_id: null });
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to save");
    }
  };

  const onEdit = (s: Section) =>
    setForm({
      id: s.id,
      name: s.name,
      slug: s.slug ?? "",
      category_id: s.category_id,
    });
  const onDelete = async (id: number) => {
    if (!confirm("Delete this section?")) return;
    try {
      await deleteSection(id);
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to delete");
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Sections</h1>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="mb-6 rounded border p-4">
        <h2 className="mb-2 font-semibold">
          {editing ? "Edit" : "Create"} Section
        </h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Name</label>
            <input className="rounded border px-3 py-2" placeholder="e.g. Summer" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Slug</label>
            <input className="rounded border px-3 py-2" placeholder="e.g. summer" value={form.slug} onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} required />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Category ID (optional)</label>
            <input className="rounded border px-3 py-2" placeholder="e.g. 1" value={form.category_id ?? ""} onChange={(e) => setForm((s) => ({ ...s, category_id: e.target.value ? Number(e.target.value) : null }))} />
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
                onClick={() =>
                  setForm({ name: "", slug: "", category_id: null })
                }
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
                <th className="px-4 py-2">Category ID</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.slug}</td>
                  <td className="px-4 py-2">{s.category_id ?? "-"}</td>
                  <td className="px-4 py-2">
                    {s.created_at
                      ? new Date(s.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        className="rounded border px-3 py-1"
                        onClick={() => onEdit(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded border px-3 py-1 text-red-600"
                        onClick={() => onDelete(s.id)}
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

export default AdminSections;
