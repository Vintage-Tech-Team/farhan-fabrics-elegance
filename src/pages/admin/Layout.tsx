import { Link, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/auth";

const AdminLayout = () => {
  const { user, role, signOut } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4">
        <h2 className="mb-4 text-xl font-semibold">Admin</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/admin">Dashboard Home</Link>
          <Link to="/admin/categories">Categories</Link>
          <Link to="/admin/sections">Sections</Link>
          <Link to="/admin/fabrics">Fabrics</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/orders">Orders</Link>
        </nav>
        <div className="mt-6 text-sm text-gray-600">
          <div>{user?.email}</div>
          <div>Role: {role ?? "unknown"}</div>
          <button
            onClick={signOut}
            className="mt-2 rounded bg-gray-900 px-3 py-1 text-white"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
