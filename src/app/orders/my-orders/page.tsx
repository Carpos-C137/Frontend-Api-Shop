"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ordersService } from "@/modules/orders";
import { Order } from "@/types/api";
import { OrderCard } from "@/components/orders/OrderCard";
import { useAuth } from "@/context/AuthContext";

export default function MyOrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    ordersService.getMyOrders().then(setOrders).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <p style={{ fontSize: 48, marginBottom: 12 }}>🔒</p>
      <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Inicia sesión para ver tus pedidos</h2>
      <Link href="/auth/login" className="btn btn-primary">Iniciar sesión</Link>
    </div>
  );

  if (loading) return <div style={{ padding: 60, textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Mis Pedidos</h1>
      <p style={{ color: "var(--fg-muted)", marginBottom: 28 }}>{orders.length} pedidos en tu historial</p>
      {error && <div className="error-box" style={{ marginBottom: 20 }}>{error}</div>}
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>📦</p>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Aún no tienes pedidos</h2>
          <Link href="/products" className="btn btn-primary">Ir al catálogo</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map(o => <OrderCard key={o.id} order={o} />)}
        </div>
      )}
    </div>
  );
}
