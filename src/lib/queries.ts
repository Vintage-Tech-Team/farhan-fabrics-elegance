import { supabase } from "./supabaseClient";

export type Category = {
  id: number;
  name: string;
  slug: string | null;
  created_at?: string;
};

// Subcategories no longer present in the current schema

export type Section = {
  id: number;
  category_id: number | null;
  name: string;
  slug: string | null;
  created_at?: string;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  stock: number | null;
  category_id: number | null;
  section_id: number | null;
  fabric_id: number | null;
  gender: "men" | "women" | "kids" | "unisex" | null;
  season: "summer" | "winter" | "all" | null;
  created_at?: string;
};

export type Fabric = {
  id: number;
  name: string;
  season: "summer" | "winter" | "all";
  created_at?: string;
};

export type ProductImage = {
  id: number;
  product_id: number;
  image_url: string; // store Cloudinary public_id
  is_primary: boolean | null;
};

type PaginatedResult<T> = {
  data: T[];
  total: number;
};

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug,created_at")
    .order("name");
  if (error) throw error;
  return data as Category[];
}

export async function createCategory(
  input: Pick<Category, "name" | "slug">
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert(input)
    .select("id,name,slug,created_at")
    .single();
  if (error) throw error;
  return data as Category;
}

export async function updateCategory(
  id: number,
  input: Partial<Pick<Category, "name" | "slug">>
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update(input)
    .eq("id", id)
    .select("id,name,slug,created_at")
    .single();
  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(id: number): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchAdminStats(): Promise<{
  categories: number;
  sections: number;
  fabrics: number;
  products: number;
  orders: number;
}> {
  const tables = [
    "categories",
    "sections",
    "fabrics",
    "products",
    "orders",
  ] as const;
  const results = await Promise.all(
    tables.map(async (t) => {
      const { count, error } = await supabase
        .from(t as string)
        .select("id", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    })
  );
  return {
    categories: results[0],
    sections: results[1],
    fabrics: results[2],
    products: results[3],
    orders: results[4],
  };
}

export async function fetchProducts(options: {
  sectionId?: number;
  page?: number;
  pageSize?: number;
  sortBy?: "price" | "created_at" | "name";
  sortDir?: "asc" | "desc";
  inStockOnly?: boolean;
  filters?: { [key: string]: string | number | boolean };
}): Promise<PaginatedResult<Product>> {
  const {
    sectionId,
    page = 1,
    pageSize = 12,
    sortBy = "created_at",
    sortDir = "desc",
    inStockOnly,
  } = options;

  let query = supabase
    .from("products")
    .select(
      "id,name,description,price,discount_price,stock,category_id,section_id,fabric_id,gender,season,created_at",
      {
        count: "exact",
      }
    );

  if (sectionId) query = query.eq("section_id", sectionId);
  if (inStockOnly) query = query.gt("stock", 0);

  query = query.order(sortBy, { ascending: sortDir === "asc" });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: (data as Product[]) ?? [], total: count ?? 0 };
}

export async function fetchSectionsByCategory(
  categoryId: number
): Promise<Section[]> {
  const { data, error } = await supabase
    .from("sections")
    .select("id,category_id,name,slug,created_at")
    .eq("category_id", categoryId)
    .order("name");
  if (error) throw error;
  return data as Section[];
}

// Sections CRUD
export async function fetchSections(): Promise<Section[]> {
  const { data, error } = await supabase
    .from("sections")
    .select("id,category_id,name,slug,created_at")
    .order("name");
  if (error) throw error;
  return data as Section[];
}

export async function createSection(
  input: Pick<Section, "name" | "slug" | "category_id">
): Promise<Section> {
  const { data, error } = await supabase
    .from("sections")
    .insert(input)
    .select("id,category_id,name,slug,created_at")
    .single();
  if (error) throw error;
  return data as Section;
}

export async function updateSection(
  id: number,
  input: Partial<Pick<Section, "name" | "slug" | "category_id">>
): Promise<Section> {
  const { data, error } = await supabase
    .from("sections")
    .update(input)
    .eq("id", id)
    .select("id,category_id,name,slug,created_at")
    .single();
  if (error) throw error;
  return data as Section;
}

export async function deleteSection(id: number): Promise<void> {
  const { error } = await supabase.from("sections").delete().eq("id", id);
  if (error) throw error;
}

// Fabrics CRUD
export async function fetchFabrics(): Promise<Fabric[]> {
  const { data, error } = await supabase
    .from("fabrics")
    .select("id,name,season,created_at")
    .order("name");
  if (error) throw error;
  return data as Fabric[];
}

export async function createFabric(
  input: Pick<Fabric, "name" | "season">
): Promise<Fabric> {
  const { data, error } = await supabase
    .from("fabrics")
    .insert(input)
    .select("id,name,season,created_at")
    .single();
  if (error) throw error;
  return data as Fabric;
}

export async function updateFabric(
  id: number,
  input: Partial<Pick<Fabric, "name" | "season">>
): Promise<Fabric> {
  const { data, error } = await supabase
    .from("fabrics")
    .update(input)
    .eq("id", id)
    .select("id,name,season,created_at")
    .single();
  if (error) throw error;
  return data as Fabric;
}

export async function deleteFabric(id: number): Promise<void> {
  const { error } = await supabase.from("fabrics").delete().eq("id", id);
  if (error) throw error;
}

// Products basic create/update/delete
export async function createProduct(input: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert(input)
    .select(
      "id,name,description,price,discount_price,stock,category_id,section_id,fabric_id,gender,season,created_at"
    )
    .single();
  if (error) throw error;
  return data as Product;
}

export async function updateProduct(
  id: number,
  input: Partial<Product>
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update(input)
    .eq("id", id)
    .select(
      "id,name,description,price,discount_price,stock,category_id,section_id,fabric_id,gender,season,created_at"
    )
    .single();
  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: number): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// Product images CRUD (table name: product_images)
export async function fetchProductImages(
  productId: number
): Promise<ProductImage[]> {
  const { data, error } = await supabase
    .from("product_images")
    .select("id,product_id,image_url,is_primary")
    .eq("product_id", productId)
    .order("id", { ascending: true });
  if (error) throw error;
  return (data as ProductImage[]) ?? [];
}

export async function addProductImage(
  productId: number,
  publicId: string,
  isPrimary = false
): Promise<ProductImage> {
  const { data, error } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      image_url: publicId,
      is_primary: isPrimary,
    })
    .select("id,product_id,image_url,is_primary")
    .single();
  if (error) throw error;
  return data as ProductImage;
}

export async function setPrimaryProductImage(
  productId: number,
  imageId: number
): Promise<void> {
  // Unset others, then set chosen one
  const { error: e1 } = await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);
  if (e1) throw e1;
  const { error: e2 } = await supabase
    .from("product_images")
    .update({ is_primary: true })
    .eq("id", imageId);
  if (e2) throw e2;
}

export async function deleteProductImage(imageId: number): Promise<void> {
  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);
  if (error) throw error;
}
