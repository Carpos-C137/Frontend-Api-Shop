"use client";
import { CartItem } from "@/types/api";
import { cartService } from "@/modules/cart";
import { useState } from "react";

interface Props { item: CartItem; onUpdate: () => void; }

export function CartItemRow({ item, onUpdate }: Props) {
  const [qty, setQty] = useState(item.quantity);
  const [loading, setLoading] = useState(false);

  const update = async (newQty: number) => {
    setLoading(true);
    try {
      if (newQty <= 0) {
        await cartService.removeItem(item.id);
      } else {
        await cartService.updateItem(item.id, { quantity: newQty });
        setQty(newQty);
      }
      onUpdate();
    } catch { /* ignore */ }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 600, fontSize: 15 }}>{item.product.name}</p>
        <p style={{ fontSize: 12, color: "var(--fg-muted)", fontFamily: "monospace" }}>{item.product.sku}</p>
        {item.product.category && <span className="badge badge-green" style={{ fontSize: 11, marginTop: 4 }}>{item.product.category.name}</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => update(qty - 1)} disabled={loading} style={{ width: 32, height: 32, borderRadius: 8, border: "2px solid var(--border)", background: "white", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>−</button>
        <span style={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>{qty}</span>
        <button onClick={() => update(qty + 1)} disabled={loading || qty >= item.product.stock} style={{ width: 32, height: 32, borderRadius: 8, border: "2px solid var(--border)", background: "white", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>+</button>
      </div>
      <div style={{ textAlign: "right", minWidth: 100 }}>
        <p style={{ fontWeight: 700, color: "var(--primary)", fontFamily: "Syne, sans-serif" }}>
          ${(Number(item.product.price) * qty).toLocaleString("es-CO")}
        </p>
        <p style={{ fontSize: 12, color: "var(--fg-muted)" }}>${Number(item.product.price).toLocaleString("es-CO")} c/u</p>
      </div>
      <button onClick={() => update(0)} disabled={loading} style={{ color: "var(--danger)", background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 4 }}>✕</button>
    </div>
  );
}
