"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { productsService } from "@/modules/products";
import { categoriesService } from "@/modules/categories";
import { Category } from "@/types/api";
import { ApiError } from "@/lib/api";

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ sku: "", name: "", description: "", price: "", stock: "0", categoryId: "", isActive: "true" });

  useEffect(() => { categoriesService.getAll().then(setCategories); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      await productsService.create({
        sku: form.sku, name: form.name, price: Number(form.price), stock: Number(form.stock),
        description: form.description || undefined, categoryId: form.categoryId ? Number(form.categoryId) : undefined,
        isActive: form.isActive === "true",
      });
      router.push("/products");
    } catch (err) { if (err instanceof ApiError) setError(err.message); }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <Link href="/products" style={{ color: "var(--fg-muted)", fontSize: 13, textDecoration: "none" }}>← Volver al catálogo</Link>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800, marginTop: 8 }}>Crear Producto</h1>
      </div>

      <div className="card" style={{ padding: 32 }}>
        {error && <div className="error-box" style={{ marginBottom: 20 }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>SKU *</label>
              <input name="sku" value={form.sku} onChange={handleChange} required className="input" placeholder="LECH-001" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Categoría</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} className="input">
                <option value="">Sin categoría</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Nombre *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="input" placeholder="Leche Entera 1L" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="input" placeholder="Descripción opcional..." rows={3} style={{ resize: "vertical" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Precio *</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className="input" placeholder="4200" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Stock</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} className="input" placeholder="50" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Estado</label>
              <select name="isActive" value={form.isActive} onChange={handleChange} className="input">
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1, justifyContent: "center", padding: 12 }}>
              {loading ? "Creando..." : "Crear Producto"}
            </button>
            <Link href="/products" className="btn btn-outline" style={{ padding: "12px 20px" }}>Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
