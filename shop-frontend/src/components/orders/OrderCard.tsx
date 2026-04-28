import Link from "next/link";
import { Order } from "@/types/api";

const statusLabel = { pending: "Pendiente", confirmed: "Confirmado", cancelled: "Cancelado" };
const statusClass = { pending: "badge-yellow", confirmed: "badge-green", cancelled: "badge-red" };

interface Props { order: Order; onDelete?: (id: number) => void; }

export function OrderCard({ order, onDelete }: Props) {
  return (
    <div className="card fade-in" style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 17 }}>Orden #{order.id}</h3>
          <p style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 2 }}>
            {new Date(order.date).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20, color: "var(--primary)" }}>
            ${Number(order.total).toLocaleString("es-CO")}
          </p>
          <span className={`badge ${statusClass[order.status]}`}>{statusLabel[order.status]}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {order.items.map((item) => (
          <span key={item.id} style={{ background: "var(--primary-light)", color: "var(--primary)", fontSize: 12, padding: "3px 10px", borderRadius: 999, fontWeight: 500 }}>
            {item.quantity}× {item.product.name}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <Link href={`/orders/${order.id}`} className="btn btn-outline" style={{ fontSize: 13 }}>Ver detalle</Link>
        {onDelete && <button onClick={() => onDelete(order.id)} className="btn btn-danger" style={{ fontSize: 13 }}>Eliminar</button>}
      </div>
    </div>
  );
}
