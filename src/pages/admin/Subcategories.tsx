import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AdminSubcategories = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    // Subcategories not in the current schema; show empty state
    setItems([]);
    if (false) console.log(error);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Subcategories</h1>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <p className="text-gray-600">
        Subcategories are not defined in the current schema.
      </p>
    </div>
  );
};

export default AdminSubcategories;
