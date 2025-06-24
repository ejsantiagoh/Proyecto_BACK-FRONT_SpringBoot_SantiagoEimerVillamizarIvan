import { NavBar } from './componentes/NavBar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthProvider } from './componentes/AuthContext';
import { RutaProtegida } from './componentes/RutaProtegida';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './paginas/Login';
import { Registrarse } from './paginas/Registrarse';
import { AdminLotes } from './paginas/admin/AdminLotes';
import { AdminClientes } from './paginas/admin/AdminClientes';
import { AdminPedidos } from './paginas/admin/AdminPedidos';
import { Error404 } from './componentes/Error404';
import { RutaPublica } from './componentes/RutaPublica';
import { AdminReportes } from './paginas/admin/AdminReportes';
import "../public/style.css"; // Importar estilos globales
import Footer from './componentes/Footer';
import { Productos } from './componentes/Productos';
import { ListaProductos } from './paginas/cliente/ListaProductos';
import { ConsultarProductos } from './paginas/cliente/ConsultarPedidos';
import { AdminOperadores } from './paginas/admin/AdminOperadores';
// import { OperadorPedidos } from './paginas/operador/OperadorPedidos';
// import { OperadorDashboard } from './paginas/operador/OperadorDashboard';
// import { ClienteHome } from './paginas/cliente/ClienteHome';

function App() {
  return (
<>

<BrowserRouter>
      <AuthProvider>
        <NavBar />
        <Routes>
          {/* Rutas públicas: solo accesibles para usuarios no autenticados */}
          <Route element={<RutaPublica />}>
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<Registrarse />} />
          </Route>

          {/* Rutas de Admin */}
          <Route
            path="/admin"
            element={<RutaProtegida rolesPermitidos={['role_administrador']} />}
          > 
          <Route path="/admin/operadores" element={<AdminOperadores />} />

            <Route path="produccion" element={<AdminLotes />} />
            <Route path="clientes" element={<AdminClientes />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="reportes" element={<AdminReportes />} />
          </Route>

          {/* Rutas de Operador */}
          <Route
            path="/operador"
            element={<RutaProtegida rolesPermitidos={['role_operador']} />}
          >
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="dashboard" element={<AdminLotes/>} />
          </Route>

          {/* Rutas de Cliente */}
          <Route
            path="/cliente"
            element={<RutaProtegida rolesPermitidos={['role_cliente']} />}
          >
            <Route path="home" element={<ListaProductos/>} />
            <Route path="listaproductos" element={<ConsultarProductos />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
      {/* <Footer/> */}
    </BrowserRouter>

    

</>
    
  );
}

export default App;