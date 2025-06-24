import React, { useEffect, useState } from 'react';
import { Pedidos } from '../../componentes/Pedidos';
import { helpHttp } from '../../helps/helpHttp';
import { Table } from '../../componentes/Table';

export const AdminPedidos = () => {
  const [db, setDb] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");

  const api = helpHttp();
  const url = "http://localhost:8081/api/cliente/pedidos";

  useEffect(() => {
    api.get(url).then((res) => {
      if (!res.err) {
        setDb(res);
        setError(null);
      } else {
        setDb(null);
        setError(res);
      }
      setLoading(false);
    });
  }, [url]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  };

  const handleEstadoChange = (e) => {
    setNuevoEstado(e.target.value);
  };

  const actualizarEstado = () => {
    const urlConQuery = `http://localhost:8081/api/operador/pedidos/${selectedOrder.id}?estado=${nuevoEstado}`;

    api.patch(urlConQuery, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (!res.err) {
        alert("Estado actualizado correctamente");
        setDb((prevDb) =>
          prevDb.map((pedido) =>
            pedido.id === selectedOrder.id ? { ...pedido, estado: nuevoEstado } : pedido
          )
        );
        setSelectedOrder((prev) => ({ ...prev, estado: nuevoEstado }));
      } else {
        alert("Error al actualizar el estado");
      }
    });
  };

  const eliminarPedido = (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este pedido?");
    if (!confirmDelete) return;

    const deleteUrl = `http://localhost:8081/api/operador/pedidos/${id}`;
    api.del(deleteUrl).then((res) => {
      if (!res.err) {
        alert("Pedido eliminado correctamente");
        setDb((prevDb) => prevDb.filter((pedido) => pedido.id !== id));
      } else {
        const parsedBody = JSON.parse(res.body);
        const mensaje = parsedBody.message;
        alert(mensaje || "Error al eliminar el pedido");
      }
    });
  };

  const renderRow = ({ item, modalId }) => (
    <tr key={item.id}>
      <td>{item.cliente.nombre}</td>
      <td>
        <span
          className={`badge ${
            item.estado === "En_Proceso"
              ? "text-bg-warning"
              : item.estado === "Pendiente"
              ? "text-bg-secondary"
              : item.estado === "Cancelado"
              ? "text-bg-danger"
              : "text-bg-success"
          }`}
        >
          {item.estado}
        </span>
      </td>
      <td>
        <button
          className="btn btn-outline-primary btn-sm me-2"
          data-bs-toggle="modal"
          data-bs-target={`#${modalId}`}
          onClick={() => {
            setSelectedOrder(item);
            setNuevoEstado(item.estado);
          }}
        >
          <i className="fas fa-eye"></i>
        </button>

        <button
          className="btn btn-danger btn-sm"
          onClick={() => eliminarPedido(item.id)}
        >
          <i className="fas fa-trash-alt "></i>
        </button>
      </td>
    </tr>
  );

  const pedidosFiltrados = db?.filter((pedido) => {
    const coincideNombre = pedido.cliente.nombre
      .toLowerCase()
      .includes(filtroNombre.toLowerCase());
    const coincideEstado =
      filtroEstado === "" || pedido.estado === filtroEstado;
    return coincideNombre && coincideEstado;
  });

  if (loading) return <div className="text-center mt-5">Cargando...</div>;
  if (error) return <div className="alert alert-danger mt-5">Error al cargar los datos</div>;

  return (
    <div className="container mt-3">
      <div className="text-center mb-5 mt-3">
        <h1 className="fw-bold">Gestión de Pedidos</h1>
        <p className="text-muted">Consultar pedidos realizados por clientes</p>
      </div>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Filtrar por nombre del cliente"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En_Proceso">En Proceso</option>
            <option value="Enviado">Enviado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {pedidosFiltrados && (
        <Table
          data={pedidosFiltrados}
          nombreTabla="Pedidos de Clientes"
          tableHeader={["Nombre del Cliente", "Estado", "Acción"]}
          modalId="orderModal"
          renderRow={renderRow}
        />
      )}

      {/* Modal */}
      <div className="modal fade" id="orderModal" tabIndex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="orderModalLabel">Detalles del Pedido</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              {selectedOrder && (
                <div>
                  <h5>Información del Cliente</h5>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p><strong>Nombre:</strong> {selectedOrder.cliente.nombre}</p>
                      <p><strong>Identificación:</strong> {selectedOrder.cliente.identificacion}</p>
                      <p><strong>Correo:</strong> {selectedOrder.cliente.correo}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Teléfono:</strong> {selectedOrder.cliente.telefono}</p>
                      <p><strong>Dirección:</strong> {selectedOrder.cliente.direccion}</p>
                      <label><strong>Estado:</strong></label>
                      <select value={nuevoEstado} onChange={handleEstadoChange} className="form-select my-2">
                        <option value="Pendiente">Pendiente</option>
                        <option value="En_Proceso">En Proceso</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                      <button className="btn btn-success btn-sm mt-2" onClick={actualizarEstado}>
                        Actualizar Estado
                      </button>
                    </div>
                  </div>

                  <h5>Información del Pedido</h5>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p><strong>Fecha de Pedido:</strong> {formatDate(selectedOrder.fechaPedido)}</p>
                      <p><strong>Fecha de Entrega:</strong> {formatDate(selectedOrder.fechaEntrega)}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Total:</strong> {formatCurrency(selectedOrder.total)}</p>
                    </div>
                  </div>

                  <h5>Detalles de Productos</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Código Lote</th>
                          <th>Producto</th>
                          <th>Descripción</th>
                          <th>Fecha Producción</th>
                          <th>Cantidad</th>
                          <th>Precio Unitario</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.detallePedidos.map((detalle) => (
                          <tr key={detalle.id}>
                            <td>{detalle.lote.codigoLote}</td>
                            <td>{detalle.lote.producto.nombre}</td>
                            <td>{detalle.lote.producto.descripcion}</td>
                            <td>{formatDate(detalle.lote.fechaProduccion)}</td>
                            <td>{detalle.cantidad}</td>
                            <td>{formatCurrency(detalle.lote.producto.precio)}</td>
                            <td>{formatCurrency(detalle.subtotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
