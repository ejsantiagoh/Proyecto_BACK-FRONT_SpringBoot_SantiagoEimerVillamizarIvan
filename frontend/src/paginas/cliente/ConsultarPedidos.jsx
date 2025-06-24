import React, { useContext, useEffect, useState } from "react";
import { helpHttp } from "../../helps/helpHttp";
import { Table } from "../../componentes/Table";
import { AuthContext } from "../../componentes/AuthContext";
import { ModalInformacionProductoCliente } from "../../componentes/Modal/ModalInformacionProductoCliente";
import "../../../public/style.css";

export const ConsultarProductos = () => {
  const [db, setDb] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [busquedaProducto, setBusquedaProducto] = useState("");

  const { user } = useContext(AuthContext);
  const id = user.userId;

  const api = helpHttp();
  const url = "http://localhost:8081/api/cliente/pedidos";

  useEffect(() => {
    api.get(url).then((res) => {
      if (!res.err) {
        console.log("Pedidos:", res);
        const filteredOrders = res.filter((order) => order.cliente.usuario.id === id);
        if (filteredOrders.length > 0) {
          const detallesConInfo = filteredOrders.flatMap((order) =>
            order.detallePedidos.map((detalle) => ({
              ...detalle,
              estado: order.estado,
              total: order.total,
              fechaEntrega: order.fechaEntrega,
            }))
          );
          setDb(detallesConInfo);
          setError(null);
        } else {
          setDb(null);
          setError({ message: "No se encontraron pedidos para este cliente" });
        }
      } else {
        setDb(null);
        setError(res);
      }
      setLoading(false);
    });
  }, [url]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  };

  const renderRow = ({ item, modalId }) => (
    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">{item.lote.producto.nombre}</td>
      <td className="px-6 py-4">{item.cantidad}</td>
      <td className="px-6 py-4">{formatCurrency(item.total)}</td>
      <td className="px-6 py-4">
        <span
          className={`badge ${
            item.estado === "En Proceso"
              ? "text-bg-warning"
              : item.estado === "Pendiente"
              ? "text-bg-secondary"
              : "text-bg-success"
          }`}
        >
          {item.estado}
        </span>
      </td>
      <td className="px-6 py-4">
        {new Date(item.fechaEntrega).toLocaleDateString("es-CO")}
      </td>
      <td className="px-6 py-4">
        <button
          className="btn btn-primary btn-sm"
          data-bs-toggle="modal"
          data-bs-target={`#${modalId}`}
          onClick={() => setSelectedDetail(item)}
        >
          Ver Detalles
        </button>
      </td>
    </tr>
  );

  const datosFiltrados = db?.filter((item) => {
    const coincideEstado = estadoFiltro === "Todos" || item.estado === estadoFiltro;
    const coincideProducto = item.lote.producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase());
    return coincideEstado && coincideProducto;
  });

  if (loading) return <div className="text-center mt-5">Cargando...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error.message}</div>;

  return (
    <div className="container mt-3">
      <div className="text-center mb-4">
        <h1 className="fw-bold">Gestión de Detalles de Pedidos</h1>
        <p className="text-muted">Consultar detalles del pedido</p>
      </div>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label fw-bold">Filtrar por estado:</label>
          <select
            className="form-select"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Entregado">Entregado</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold">Buscar por producto:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ej: Atún en agua"
            value={busquedaProducto}
            onChange={(e) => setBusquedaProducto(e.target.value)}
          />
        </div>
      </div>

      {datosFiltrados && (
        <Table
          data={datosFiltrados}
          nombreTabla="Detalles de Pedidos"
          tableHeader={[
            "Producto",
            "Cantidad",
            "Total Pedido",
            "Estado Pedido",
            "Fecha Entrega",
            "Acción",
          ]}
          modalId="detailModal"
          renderRow={renderRow}
        />
      )}

      <ModalInformacionProductoCliente
        formatCurrency={formatCurrency}
        id="detailModal"
        selectedDetail={selectedDetail}
        orderTotal={selectedDetail?.total}
        orderEstado={selectedDetail?.estado}
      />
    </div>
  );
};
