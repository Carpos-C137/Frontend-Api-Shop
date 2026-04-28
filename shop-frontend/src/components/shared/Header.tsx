"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const publicLinks = [
  { href: "/", label: "Inicio" },
  { href: "/products", label: "Productos" },
  { href: "/categories", label: "Categorías" },
];
const authLinks = [
  { href: "/cart", label: "🛒 Carrito" },
  { href: "/orders/my-orders", label: "Mis Pedidos" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLogout = () => { logout(); router.push("/"); };

  return (
    <nav style={{ background: "var(--primary)", boxShadow: "0 2px 16px rgba(0,0,0,0.15)", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 24, height: 64 }}>
        <Link href="/" style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20, color: "white", textDecoration: "none", letterSpacing: "-0.5px", flexShrink: 0 }}>
          🛍️ SuperShop
        </Link>
        <div style={{ display: "flex", gap: 4, flex: 1, flexWrap: "wrap" }}>
          {[...publicLinks, ...(isAuthenticated ? authLinks : [])].map((link) => (
            <Link key={link.href} href={link.href} style={{
              color: isActive(link.href) ? "white" : "rgba(255,255,255,0.72)",
              fontWeight: isActive(link.href) ? 600 : 400, fontSize: 14,
              textDecoration: "none", padding: "6px 12px", borderRadius: 8,
              background: isActive(link.href) ? "rgba(255,255,255,0.18)" : "transparent",
              transition: "all 0.2s",
            }}>
              {link.label}
            </Link>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {isAuthenticated ? (
            <>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>
                Hola, <strong>{user?.name.split(" ")[0]}</strong>
              </span>
              <button onClick={handleLogout} className="btn" style={{ background: "rgba(255,255,255,0.15)", color: "white", fontSize: 13, padding: "7px 14px" }}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn" style={{ background: "rgba(255,255,255,0.15)", color: "white", fontSize: 13, padding: "7px 14px" }}>
                Iniciar sesión
              </Link>
              <Link href="/auth/register" className="btn btn-accent" style={{ fontSize: 13, padding: "7px 14px" }}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
