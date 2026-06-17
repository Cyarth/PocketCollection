import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <main className="profile-page">
      <section className="profile-card">
        <h1>Mi perfil</h1>

        <p>
          <strong>Usuario:</strong> {user?.username}
        </p>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <button onClick={handleLogout}>Cerrar sesión</button>
      </section>
    </main>
  );
}