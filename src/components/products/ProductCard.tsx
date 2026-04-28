"use client";
import Link from "next/link";
import { Product } from "@/types/api";
import { cartService } from "@/modules/cart";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

interface Props { product: Product; onDelete?: (sku: string) => void; }

export function ProductCard({ product, onDelete }: Props) {
  const { isAuthenticated } = useAuth();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await cartService.addItem({ productSku: product.sku, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch { /* ignore */ }
    setAdding(false);
  };

  return (
    <div className="card fade-in" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--fg-muted)", background: "var(--primary-light)", padding: "2px 8px", borderRadius: 4 }}>
          {product.sku}
        </span>
        {product.category && (
          <span className="badge badge-green" style={{ fontSize: 11 }}>{product.category.name}</span>
        )}
      </div>

      <div>
        <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{product.name}</h3>
        {product.description && <p style={{ fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.5 }}>{product.description}</p>}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 22, color: "var(--primary)" }}>
          ${Number(product.price).toLocaleString("es-CO")}
        </span>
        <span style={{ fontSize: 12, color: product.stock > 0 ? "var(--fg-muted)" : "var(--danger)" }}>
          {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
        </span>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
        {isAuthenticated && product.stock > 0 && (
          <button onClick={handleAddToCart} disabled={adding} className="btn btn-primary" style={{ flex: 1, fontSize: 13, justifyContent: "center" }}>
            {added ? "✓ Agregado" : adding ? "..." : "Agregar al carrito"}
          </button>
        )}
        <Link href={`/products/${product.sku}`} className="btn btn-outline" style={{ fontSize: 13 }}>Ver</Link>
        {onDelete && (
          <button onClick={() => onDelete(product.sku)} className="btn btn-danger" style={{ fontSize: 13 }}>Eliminar</button>
        )}
      </div>
    </div>
  );
}
