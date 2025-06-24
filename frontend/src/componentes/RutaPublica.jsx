import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export const RutaPublica = () => {
  const { user } = useContext(AuthContext);
  if (user) {
    const rol = user.role ? user.role.toLowerCase() : "";
    switch (rol) {
      case 'role_administrador':
        return <Navigate to="/admin/produccion" replace />;
      case 'role_operador':
        return <Navigate to="/operador/dashboard" replace />;
      case 'role_cliente':
        return <Navigate to="/cliente/home" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  return <Outlet />;
};