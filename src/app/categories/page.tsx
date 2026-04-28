"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { categoriesService } from "@/modules/categories";
import { Category } from "@/types/api";
import { useAuth } from "@/context/AuthContext";

export default function CategoriesPage() {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoriesService.getAll().then(setCategories).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    try { await categoriesService.delete(id); setCategories(prev => prev.filter(c => c.id !== id)); }
    catch (err) { setError(err instanceof Error ? err.message : "Error"); }
  };

  if (loading) return <div style={{ padding: 60, textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }} className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 30, fontWeight: 800 }}>Categorías</h1>
          <p style={{ color: "var(--fg-muted)", marginTop: 4 }}>{categories.length} categorías</p>
        </div>
        {isAuthenticated && <Link href="/categories/create" className="btn btn-primary">+ Nueva Categoría</Link>}
      </div>
      {error && <div className="error-box" style={{ marginBottom: 20 }}>{error}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {categories.map(cat => (
          <div key={cat.id} className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 17 }}>{cat.name}</h3>
            {cat.description && <p style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 6 }}>{cat.description}</p>}
            <p style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 8 }}>{cat.products?.length || 0} productos</p>
            {isAuthenticated && (
              <button onClick={() => handleDelete(cat.id)} className="btn btn-danger" style={{ fontSize: 12, marginTop: 12, padding: "6px 14px" }}>Eliminar</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
