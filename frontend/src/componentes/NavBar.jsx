import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Depurar el objeto user para inspeccionar el rol
  console.log("User en NavBar:", user);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return null; // No renderizar el NavBar si no hay usuario autenticado
  }

  // Usar user.role directamente y normalizar a minúsculas para evitar problemas de case-sensitivity
  const rol = user.role ? user.role.toLowerCase() : "";

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container">
        <a
          className="navbar-brand fw-bold text-black d-flex align-items-center gap-2 fs-6"
          href="#"
        >
          <i className="fas fa-fish "></i>
          ATUNPACIFICO
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav gap-3">
            {rol === "role_administrador" && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/admin/produccion"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link text-dark border-bottom border-3 border-dark"
                        : "nav-link text-secondary"
                    }
                  >
                    Producción
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/admin/pedidos"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link text-dark border-bottom border-3 border-dark"
                        : "nav-link text-secondary"
                    }
                  >
                    Pedidos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/admin/clientes"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link text-dark border-bottom border-3 border-dark"
                        : "nav-link text-secondary"
                    }
                  >
                    Clientes
                  </NavLink>
                </li>
                                <li className="nav-item">
                  <NavLink
                    to="/admin/operadores"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link text-dark border-bottom border-3 border-dark"
                        : "nav-link text-secondary"
                    }
                  >
                    Operadores
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/admin/reportes"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link text-dark border-bottom border-3 border-dark"
                        : "nav-link text-secondary"
                    }
                  >
                    Reportes
                  </NavLink>
                </li>
              </>
            )}
            {rol === "role_operador" && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/operador/pedidos"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link text-dark border-bottom border-3 border-dark"
                        : "nav-link text-secondary"
                    }
                  >
                    Pedidos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/operador/dashboard"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link text-dark border-bottom border-3 border-dark"
                        : "nav-link text-secondary"
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
              </>
            )}
            {rol === "role_cliente" && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/cliente/home"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link text-dark border-bottom border-3 border-dark"
                        : "nav-link text-secondary"
                    }
                  >
                    Lista de productos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/cliente/listaproductos"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link text-dark border-bottom border-3 border-dark"
                        : "nav-link text-secondary"
                    }
                  >
                    Pedidos realizados
                  </NavLink>
                </li>
              </>
            )}
            <li className="nav-item">
              <button
                className="nav-link text-secondary btn btn-link"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};