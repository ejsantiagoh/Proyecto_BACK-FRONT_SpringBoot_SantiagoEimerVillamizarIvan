import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export const RutaProtegida = ({ rolesPermitidos }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Si no hay usuario autenticado, redirigir al login
    return <Navigate to="/" replace />;
  }

  // Normalizar el rol del usuario a minúsculas
  const userRole = user.role ? user.role.toLowerCase() : "";
  // Normalizar los roles permitidos a minúsculas
  const normalizedRoles = rolesPermitidos.map(role => role.toLowerCase());

  if (!normalizedRoles.includes(userRole)) {
    // Si el usuario no tiene el rol permitido, redirigir a una página de error
    return <Navigate to="/error404" replace />;
  }

  // Si el usuario está autenticado y tiene el rol correcto, renderizar las rutas hijas
  return <Outlet />;
};