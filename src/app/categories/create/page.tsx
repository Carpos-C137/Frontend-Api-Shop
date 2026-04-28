"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { categoriesService } from "@/modules/categories";
import { ApiError } from "@/lib/api";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      await categoriesService.create({ name: form.name, description: form.description || undefined });
      router.push("/categories");
    } catch (err) { if (err instanceof ApiError) setError(err.message); }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: "0 24px" }}>
      <Link href="/categories" style={{ color: "var(--fg-muted)", fontSize: 13, textDecoration: "none" }}>← Volver</Link>
      <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 26, fontWeight: 800, margin: "12px 0 24px" }}>Nueva Categoría</h1>
      <div className="card" style={{ padding: 32 }}>
        {error && <div className="error-box" style={{ marginBottom: 20 }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Nombre *</label>
            <input name="name" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required className="input" placeholder="Ej: Lácteos" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Descripción</label>
            <input name="description" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} className="input" placeholder="Descripción opcional" />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1, justifyContent: "center", padding: 12 }}>
              {loading ? "Creando..." : "Crear categoría"}
            </button>
            <Link href="/categories" className="btn btn-outline" style={{ padding: "12px 20px" }}>Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
