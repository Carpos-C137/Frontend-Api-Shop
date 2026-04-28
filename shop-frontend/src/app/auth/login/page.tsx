"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/modules/auth";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authService.login(form);
      login(res.access_token, res.user);
      router.push("/products");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="card fade-in" style={{ width: "100%", maxWidth: 420, padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: 48 }}>🛍️</span>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 26, fontWeight: 800, marginTop: 12 }}>Iniciar sesión</h1>
          <p style={{ color: "var(--fg-muted)", fontSize: 14, marginTop: 4 }}>Bienvenido de vuelta</p>
        </div>

        {error && <div className="error-box" style={{ marginBottom: 20 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--fg)" }}>Correo electrónico</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="input" placeholder="tu@email.com" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Contraseña</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required className="input" placeholder="••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15, marginTop: 8 }}>
            {loading ? "Iniciando..." : "Iniciar sesión"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--fg-muted)" }}>
          ¿No tienes cuenta?{" "}
          <Link href="/auth/register" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
