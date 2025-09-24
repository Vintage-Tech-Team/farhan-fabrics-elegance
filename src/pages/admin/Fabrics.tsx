import { useEffect, useMemo, useState } from "react";
import {
  createFabric,
  deleteFabric,
  fetchFabrics,
  Fabric,
  updateFabric,
} from "@/lib/queries";

const AdminFabrics = () => {
  const [items, setItems] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      items.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const [form, setForm] = useState<{
    id?: number;
    name: string;
    season: Fabric["season"];
  }>({ name: "", season: "all" });
  const editing = Boolean(form.id);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFabrics();
      setItems(data);
    } catch (e: any) {
      setError(e.message || "Failed to load fabrics");
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
        await updateFabric(form.id, { name: form.name, season: form.season });
      } else {
        await createFabric({ name: form.name, season: form.season });
      }
      setForm({ name: "", season: "all" });
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to save");
    }
  };

  const onEdit = (f: Fabric) =>
    setForm({ id: f.id, name: f.name, season: f.season });
  const onDelete = async (id: number) => {
    if (!confirm("Delete this fabric?")) return;
    try {
      await deleteFabric(id);
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to delete");
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Fabrics</h1>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="mb-6 rounded border p-4">
        <h2 className="mb-2 font-semibold">
          {editing ? "Edit" : "Create"} Fabric
        </h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Name</label>
            <input
              className="rounded border px-3 py-2"
              placeholder="e.g. Khaddar"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Season</label>
            <select
              className="rounded border px-3 py-2"
              value={form.season}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  season: e.target.value as Fabric["season"],
                }))
              }
            >
            <option value="all">All</option>
            <option value="summer">Summer</option>
            <option value="winter">Winter</option>
            </select>
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
                onClick={() => setForm({ name: "", season: "all" })}
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
                <th className="px-4 py-2">Season</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className="border-t">
                  <td className="px-4 py-2">{f.name}</td>
                  <td className="px-4 py-2">{f.season}</td>
                  <td className="px-4 py-2">
                    {f.created_at
                      ? new Date(f.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        className="rounded border px-3 py-1"
                        onClick={() => onEdit(f)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded border px-3 py-1 text-red-600"
                        onClick={() => onDelete(f.id)}
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

export default AdminFabrics;
