import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WhatsappButton from "./components/WhatsappButton";
import { AuthProvider, useAuth } from "@/lib/auth";
import Login from "./pages/Login";
import {
  AdminDashboard,
  AdminLayout,
  AdminCategories,
  AdminSections,
  AdminProducts,
  AdminFabrics,
  AdminOrders,
  ProductDetails,
} from "./pages/admin";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, role, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Login />;
  if (role !== "admin") return <NotFound />;
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="sections" element={<AdminSections />} />
              <Route path="fabrics" element={<AdminFabrics />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="orders" element={<AdminOrders />} />
              {/* Future: nested admin CRUD routes here */}
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <WhatsappButton
            phoneNumber="+923227500068"
            defaultMessage="Hello! I'd like to know more about your products."
          />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
