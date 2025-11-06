// src/app/(admin)/layout.js


import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: "Admin Dashboard | GreenMart",
  description: "Manage products, orders, and users from the GreenMart admin panel.",
};

export default function AdminLayouts({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
