export default function Loading() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 0" }}>
      <div style={{ textAlign: "center" }}>
        <div className="spinner" style={{ margin: "0 auto" }} />
        <p style={{ color: "var(--fg-muted)", marginTop: 16, fontFamily: "Syne, sans-serif" }}>Cargando...</p>
      </div>
    </div>
  );
}
