"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { productsService } from "@/modules/products";
import { categoriesService } from "@/modules/categories";
import { Product, Category } from "@/types/api";
import { ProductCard } from "@/components/products/ProductCard";
import { useAuth } from "@/context/AuthContext";

export default function ProductsPage() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([productsService.getAll(), categoriesService.getAll()])
      .then(([p, c]) => { setProducts(p); setCategories(c); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (sku: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await productsService.delete(sku);
      setProducts(prev => prev.filter(p => p.sku !== sku));
    } catch (err) { setError(err instanceof Error ? err.message : "Error"); }
  };

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === null || p.category?.id === selectedCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (loading) return <div style={{ textAlign: "center", padding: 80 }}><div className="spinner" style={{ margin: "0 auto" }} /></div>;

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 32, fontWeight: 800 }}>Catálogo</h1>
          <p style={{ color: "var(--fg-muted)", marginTop: 4 }}>{filtered.length} productos disponibles</p>
        </div>
        {isAuthenticated && (
          <Link href="/products/create" className="btn btn-primary">+ Nuevo Producto</Link>
        )}
      </div>

      {error && <div className="error-box" style={{ marginBottom: 24 }}>{error}</div>}

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} className="input" placeholder="🔍 Buscar producto..." style={{ maxWidth: 280 }} />
        <button onClick={() => setSelectedCategory(null)} className={`btn ${selectedCategory === null ? "btn-primary" : "btn-outline"}`} style={{ fontSize: 13 }}>
          Todos
        </button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
            className={`btn ${selectedCategory === cat.id ? "btn-primary" : "btn-outline"}`} style={{ fontSize: 13 }}>
            {cat.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--fg-muted)" }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
          <p style={{ fontFamily: "Syne, sans-serif", fontSize: 18 }}>No se encontraron productos</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {filtered.map(p => <ProductCard key={p.sku} product={p} onDelete={isAuthenticated ? handleDelete : undefined} />)}
        </div>
      )}
    </div>
  );
}
