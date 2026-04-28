import Link from "next/link";

export default function HomePage() {
  const features = [
    { icon: "🥛", title: "Lácteos", color: "#e3f2e3" },
    { icon: "🥩", title: "Carnes", color: "#fdecea" },
    { icon: "🧴", title: "Aseo", color: "#e8f0fe" },
    { icon: "🥤", title: "Bebidas", color: "#fff8e7" },
    { icon: "🍞", title: "Panadería", color: "#fef3e2" },
    { icon: "🧹", title: "Hogar", color: "#f3e5f5" },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a4d1a 100%)", color: "white", padding: "80px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(240,165,0,0.1) 0%, transparent 40%)" }} />
        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: 3, color: "var(--accent)", marginBottom: 16, textTransform: "uppercase" }}>Bienvenido a</p>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 56, fontWeight: 800, marginBottom: 20, lineHeight: 1.1 }}>SuperShop</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", marginBottom: 40, lineHeight: 1.6 }}>
            Tu tienda de confianza. Encuentra todo lo que necesitas con los mejores precios.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/products" className="btn" style={{ background: "white", color: "var(--primary)", fontSize: 15, padding: "14px 32px", fontWeight: 700 }}>
              Ver productos
            </Link>
            <Link href="/auth/register" className="btn btn-accent" style={{ fontSize: 15, padding: "14px 32px" }}>
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ maxWidth: 900, margin: "60px auto", padding: "0 24px" }}>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 8, textAlign: "center" }}>Categorías</h2>
        <p style={{ textAlign: "center", color: "var(--fg-muted)", marginBottom: 36 }}>Encuentra lo que necesitas</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 16 }}>
          {features.map((f) => (
            <Link key={f.title} href={`/products`} style={{ textDecoration: "none", background: f.color, borderRadius: 16, padding: "24px 16px", textAlign: "center", transition: "transform 0.2s", display: "block" }}
              className="card">
              <span style={{ fontSize: 36 }}>{f.icon}</span>
              <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, marginTop: 10, color: "var(--fg)", fontSize: 14 }}>{f.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--primary-light)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "60px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 12 }}>¿Listo para comprar?</h2>
        <p style={{ color: "var(--fg-muted)", marginBottom: 28 }}>Regístrate, llena tu carrito y realiza tu pedido</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/products" className="btn btn-primary" style={{ fontSize: 15, padding: "12px 28px" }}>Explorar catálogo</Link>
          <Link href="/auth/login" className="btn btn-outline" style={{ fontSize: 15, padding: "12px 28px" }}>Iniciar sesión</Link>
        </div>
      </section>
    </div>
  );
}
