import { useEffect, useState } from "react";
import { fetchAdminStats } from "@/lib/queries";

const AdminDashboard = () => {
  const [stats, setStats] = useState<{
    categories: number;
    sections: number;
    fabrics: number;
    products: number;
    orders: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const s = await fetchAdminStats();
        setStats(s);
      } catch (e: any) {
        setError(e.message || "Failed to load stats");
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {stats ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="rounded border p-4">
            <div className="text-sm text-gray-600">Categories</div>
            <div className="text-2xl font-semibold">{stats.categories}</div>
          </div>
          <div className="rounded border p-4">
            <div className="text-sm text-gray-600">Sections</div>
            <div className="text-2xl font-semibold">{stats.sections}</div>
          </div>
          <div className="rounded border p-4">
            <div className="text-sm text-gray-600">Fabrics</div>
            <div className="text-2xl font-semibold">{stats.fabrics}</div>
          </div>
          <div className="rounded border p-4">
            <div className="text-sm text-gray-600">Products</div>
            <div className="text-2xl font-semibold">{stats.products}</div>
          </div>
          <div className="rounded border p-4">
            <div className="text-sm text-gray-600">Orders</div>
            <div className="text-2xl font-semibold">{stats.orders}</div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Loading stats…</p>
      )}
    </div>
  );
};

export default AdminDashboard;
