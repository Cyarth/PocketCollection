import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const data = await loginUser({ email, password });
      login(data.token, data.user);
      navigate("/profile");
    } catch {
      alert("Email o contraseña incorrectos");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Iniciar sesión</h1>
        <p>Entra a tu cuenta de PocketCollection.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Entrar</button>
        </form>

        <span>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </span>
      </section>
    </main>
  );
}