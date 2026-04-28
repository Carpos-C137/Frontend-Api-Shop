"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/modules/auth";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", age: "" });
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
      const res = await authService.register({
        name: form.name, email: form.email, password: form.password,
        ...(form.age ? { age: Number(form.age) } : {}),
      });
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
          <span style={{ fontSize: 48 }}>✨</span>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 26, fontWeight: 800, marginTop: 12 }}>Crear cuenta</h1>
          <p style={{ color: "var(--fg-muted)", fontSize: 14, marginTop: 4 }}>Únete a SuperShop</p>
        </div>

        {error && <div className="error-box" style={{ marginBottom: 20 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { name: "name", label: "Nombre completo", type: "text", placeholder: "Juan Pérez", required: true },
            { name: "email", label: "Correo electrónico", type: "email", placeholder: "tu@email.com", required: true },
            { name: "password", label: "Contraseña (mín. 6 caracteres)", type: "password", placeholder: "••••••", required: true },
            { name: "age", label: "Edad (opcional)", type: "number", placeholder: "25", required: false },
          ].map(field => (
            <div key={field.name}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{field.label}</label>
              <input name={field.name} type={field.type} value={form[field.name as keyof typeof form]}
                onChange={handleChange} required={field.required} className="input" placeholder={field.placeholder} />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15, marginTop: 8 }}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--fg-muted)" }}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
