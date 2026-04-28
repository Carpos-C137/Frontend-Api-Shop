"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ordersService } from "@/modules/orders";
import { Order } from "@/types/api";

const statusLabel = { pending: "Pendiente", confirmed: "Confirmado", cancelled: "Cancelado" };
const statusClass = { pending: "badge-yellow", confirmed: "badge-green", cancelled: "badge-red" };

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ordersService.getById(Number(id)).then(setOrder).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta orden?")) return;
    await ordersService.delete(Number(id));
    router.push("/orders/my-orders");
  };

  if (loading) return <div style={{ padding: 60, textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>;
  if (error) return <div className="error-box" style={{ margin: 40 }}>{error}</div>;
  if (!order) return <p>Orden no encontrada</p>;

  return (
    <div className="fade-in">
      <Link href="/orders/my-orders" style={{ color: "var(--fg-muted)", fontSize: 13, textDecoration: "none" }}>← Mis pedidos</Link>

      <div className="card" style={{ padding: 36, marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800 }}>Orden #{order.id}</h1>
            <p style={{ color: "var(--fg-muted)", fontSize: 14, marginTop: 4 }}>
              {new Date(order.date).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
            <span className={`badge ${statusClass[order.status]}`} style={{ marginTop: 8, display: "inline-block" }}>{statusLabel[order.status]}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "Syne, sans-serif", fontSize: 32, fontWeight: 800, color: "var(--primary)" }}>
              ${Number(order.total).toLocaleString("es-CO")}
            </p>
            <p style={{ fontSize: 12, color: "var(--fg-muted)" }}>Total de la orden</p>
          </div>
        </div>

        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 16, color: "var(--fg-muted)" }}>
          PRODUCTOS ({order.items.length})
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          {order.items.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg)", padding: "14px 18px", borderRadius: 10 }}>
              <div>
                <p style={{ fontWeight: 600 }}>{item.product.name}</p>
                <p style={{ fontSize: 12, color: "var(--fg-muted)", fontFamily: "monospace" }}>{item.product.sku}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontWeight: 700, color: "var(--primary)" }}>${(Number(item.unitPrice) * item.quantity).toLocaleString("es-CO")}</p>
                <p style={{ fontSize: 12, color: "var(--fg-muted)" }}>{item.quantity} × ${Number(item.unitPrice).toLocaleString("es-CO")}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleDelete} className="btn btn-danger">Eliminar orden</button>
          <Link href="/products" className="btn btn-outline">Seguir comprando</Link>
        </div>
      </div>
    </div>
  );
}
