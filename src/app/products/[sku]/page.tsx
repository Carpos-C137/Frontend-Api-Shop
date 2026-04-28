"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { productsService } from "@/modules/products";
import { categoriesService } from "@/modules/categories";
import { cartService } from "@/modules/cart";
import { Product, Category } from "@/types/api";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ProductDetailPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [qty, setQty] = useState(1);
  const [cartMsg, setCartMsg] = useState("");
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", categoryId: "", isActive: "true" });

  useEffect(() => {
    Promise.all([productsService.getBySku(sku), categoriesService.getAll()])
      .then(([p, c]) => {
        setProduct(p); setCategories(c);
        setForm({ name: p.name, description: p.description || "", price: String(p.price), stock: String(p.stock), categoryId: String(p.category?.id || ""), isActive: String(p.isActive) });
      })
      .catch(err => setError(err.message)).finally(() => setLoading(false));
  }, [sku]);

  const handleAddToCart = async () => {
    try {
      await cartService.addItem({ productSku: sku, quantity: qty });
      setCartMsg("✓ Agregado al carrito");
      setTimeout(() => setCartMsg(""), 2500);
    } catch (err) { if (err instanceof ApiError) setCartMsg(err.message); }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este producto?")) return;
    await productsService.delete(sku);
    router.push("/products");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    try {
      const updated = await productsService.update(sku, {
        name: form.name, description: form.description || undefined, price: Number(form.price),
        stock: Number(form.stock), categoryId: form.categoryId ? Number(form.categoryId) : undefined,
        isActive: form.isActive === "true",
      });
      setProduct(updated); setEditing(false);
    } catch (err) { if (err instanceof ApiError) setError(err.message); }
  };

  if (loading) return <div style={{ padding: 80, textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>;
  if (error && !product) return <div className="error-box" style={{ margin: 40 }}>{error}</div>;
  if (!product) return <p>Producto no encontrado</p>;

  if (editing) return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Editar: {product.sku}</h2>
      <div className="card" style={{ padding: 32 }}>
        {error && <div className="error-box" style={{ marginBottom: 20 }}>{error}</div>}
        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[["name","Nombre","text",true],["description","Descripción","text",false],["price","Precio","number",true],["stock","Stock","number",true]].map(([n,l,t,r]) => (
            <div key={n as string}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{l as string}</label>
              <input name={n as string} type={t as string} value={form[n as keyof typeof form]} required={r as boolean}
                onChange={e => setForm(prev => ({...prev, [e.target.name]: e.target.value}))} className="input" />
            </div>
          ))}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Categoría</label>
            <select name="categoryId" value={form.categoryId} onChange={e => setForm(prev => ({...prev, categoryId: e.target.value}))} className="input">
              <option value="">Sin categoría</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>Guardar</button>
            <button type="button" onClick={() => setEditing(false)} className="btn btn-outline">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }} className="fade-in">
      <Link href="/products" style={{ color: "var(--fg-muted)", fontSize: 13, textDecoration: "none" }}>← Volver al catálogo</Link>
      <div className="card" style={{ padding: 36, marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <span style={{ fontFamily: "monospace", fontSize: 12, background: "var(--primary-light)", color: "var(--primary)", padding: "3px 10px", borderRadius: 6 }}>{product.sku}</span>
          {product.category && <span className="badge badge-green">{product.category.name}</span>}
        </div>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 30, fontWeight: 800, marginTop: 12 }}>{product.name}</h1>
        {product.description && <p style={{ color: "var(--fg-muted)", marginTop: 10, lineHeight: 1.7 }}>{product.description}</p>}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "28px 0", padding: "20px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontFamily: "Syne, sans-serif", fontSize: 36, fontWeight: 800, color: "var(--primary)" }}>
            ${Number(product.price).toLocaleString("es-CO")}
          </span>
          <span style={{ fontSize: 13, color: product.stock > 0 ? "var(--fg-muted)" : "var(--danger)", fontWeight: 600 }}>
            {product.stock > 0 ? `${product.stock} unidades disponibles` : "Sin stock"}
          </span>
        </div>

        {isAuthenticated && product.stock > 0 && (
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, border: "2px solid var(--border)", borderRadius: 8, padding: "4px 8px" }}>
              <button onClick={() => setQty(q => Math.max(1, q-1))} style={{ background: "none", border: "none", fontSize: 20, fontWeight: 700, cursor: "pointer", padding: "0 4px" }}>−</button>
              <span style={{ fontWeight: 700, minWidth: 28, textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q+1))} style={{ background: "none", border: "none", fontSize: 20, fontWeight: 700, cursor: "pointer", padding: "0 4px" }}>+</button>
            </div>
            <button onClick={handleAddToCart} className="btn btn-primary" style={{ flex: 1, justifyContent: "center", padding: 12 }}>
              🛒 Agregar al carrito
            </button>
          </div>
        )}
        {cartMsg && <p style={{ color: "var(--primary)", fontWeight: 600, marginBottom: 16 }}>{cartMsg}</p>}
        {!isAuthenticated && <p style={{ color: "var(--fg-muted)", marginBottom: 16, fontSize: 14 }}>
          <Link href="/auth/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Inicia sesión</Link> para agregar al carrito
        </p>}

        {isAuthenticated && (
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setEditing(true)} className="btn btn-accent">Editar</button>
            <button onClick={handleDelete} className="btn btn-danger">Eliminar</button>
          </div>
        )}
      </div>
    </div>
  );
}
