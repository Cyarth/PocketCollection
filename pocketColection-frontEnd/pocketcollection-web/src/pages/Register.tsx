import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await registerUser({ username, email, password });
      alert("Usuario creado correctamente");
      navigate("/login");
    } catch {
      alert("No se pudo crear el usuario");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Crear cuenta</h1>
        <p>Registra tu cuenta para guardar tu colección.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

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

          <button type="submit">Registrarme</button>
        </form>

        <span>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </span>
      </section>
    </main>
  );
}