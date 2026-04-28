"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cartService } from "@/modules/cart";
import { ordersService } from "@/modules/orders";
import { Cart } from "@/types/api";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    try { setCart(await cartService.getCart()); } catch (err) { setError(err instanceof Error ? err.message : "Error"); }
    setLoading(false);
  }, []);

  useEffect(() => { if (isAuthenticated) loadCart(); else setLoading(false); }, [isAuthenticated, loadCart]);

  const handleClear = async () => {
    if (!confirm("¿Vaciar el carrito?")) return;
    await cartService.clearCart();
    loadCart();
  };

  const handleOrder = async () => {
    if (!cart?.items.length) return;
    setOrdering(true); setError(null);
    try {
      const order = await ordersService.create({
        items: cart.items.map(i => ({ productSku: i.product.sku, quantity: i.quantity }))
      });
      await cartService.clearCart();
      router.push(`/orders/${order.id}`);
    } catch (err) { setError(err instanceof Error ? err.message : "Error al crear la orden"); }
    setOrdering(false);
  };

  if (!isAuthenticated) return (
    <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center", padding: 24 }}>
      <p style={{ fontSize: 64, marginBottom: 16 }}>🔒</p>
      <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Debes iniciar sesión</h2>
      <p style={{ color: "var(--fg-muted)", marginBottom: 28 }}>Para ver tu carrito necesitas una cuenta</p>
      <Link href="/auth/login" className="btn btn-primary" style={{ fontSize: 15, padding: "12px 32px" }}>Iniciar sesión</Link>
    </div>
  );

  if (loading) return <div style={{ padding: 80, textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>;

  const total = cart?.items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0) || 0;
  const isEmpty = !cart?.items.length;

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px" }} className="fade-in">
      <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 32, fontWeight: 800, marginBottom: 8 }}>🛒 Mi Carrito</h1>
      {error && <div className="error-box" style={{ marginBottom: 20 }}>{error}</div>}

      {isEmpty ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ fontSize: 64, marginBottom: 16 }}>🛒</p>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Tu carrito está vacío</h2>
          <p style={{ color: "var(--fg-muted)", marginBottom: 28 }}>Agrega productos desde el catálogo</p>
          <Link href="/products" className="btn btn-primary" style={{ fontSize: 15, padding: "12px 28px" }}>Ver productos</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28, alignItems: "start" }}>
          <div className="card" style={{ padding: "8px 24px" }}>
            {cart?.items.map(item => <CartItemRow key={item.id} item={item} onUpdate={loadCart} />)}
            <div style={{ padding: "16px 0" }}>
              <button onClick={handleClear} style={{ fontSize: 13, color: "var(--danger)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Vaciar carrito
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: 28, position: "sticky", top: 24 }}>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Resumen</h2>
            {cart?.items.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8, color: "var(--fg-muted)" }}>
                <span>{item.quantity}× {item.product.name}</span>
                <span>${(Number(item.product.price) * item.quantity).toLocaleString("es-CO")}</span>
              </div>
            ))}
            <div style={{ borderTop: "2px solid var(--border)", marginTop: 16, paddingTop: 16, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 17 }}>Total</span>
              <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 22, color: "var(--primary)" }}>
                ${total.toLocaleString("es-CO")}
              </span>
            </div>
            <button onClick={handleOrder} disabled={ordering} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 14, marginTop: 20, fontSize: 15 }}>
              {ordering ? "Procesando..." : "✓ Confirmar pedido"}
            </button>
            <Link href="/products" className="btn btn-outline" style={{ width: "100%", justifyContent: "center", padding: 12, marginTop: 10, fontSize: 14 }}>
              Seguir comprando
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
