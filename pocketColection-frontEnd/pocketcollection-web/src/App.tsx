import { useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import SearchCards from "./pages/SearchCards";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";
import CardDetail from "./pages/CardDetail";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "U";

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        PocketCollection
      </Link>

      <nav>
        <Link to="/">Buscar cartas</Link>

        {isAuthenticated ? (
          <div className="user-menu-container">
            <button
              className="avatar-button"
              onClick={() => setShowMenu(!showMenu)}
            >
              {avatarLetter}
            </button>

            {showMenu && (
              <div className="user-dropdown">
                <Link to="/profile" onClick={() => setShowMenu(false)}>
                  Mi perfil
                </Link>

                <Link to="/collections" onClick={() => setShowMenu(false)}>
                  Mis colecciones
                </Link>

                <Link to="/settings" onClick={() => setShowMenu(false)}>
                  Configuración
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">Ingresar</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<SearchCards />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cards/:id" element={<CardDetail />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/collections"
          element={
            <ProtectedRoute>
              <Collections />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collections/:id"
          element={
            <ProtectedRoute>
              <CollectionDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
