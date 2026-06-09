"use client";

import Header from "@/components/Header";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AdminDashboard />
    </div>
  );
}
