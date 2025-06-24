// componentes/Modal/HistorialModal.jsx
import React, { useEffect, useState } from "react";
import { helpHttp } from "../../helps/helpHttp";

export const HistorialModal = ({ clienteId, clienteNombre }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = helpHttp();
  const url = `http://localhost:8081/api/admin/clientes/${clienteId}/historial`;

  useEffect(() => {
    if (clienteId) {
      setLoading(true);
      setError(null);
      api.get(url).then((res) => {
        if (!res.err) {
          setHistorial(res);
        } else {
          setHistorial([]);
          setError(res.statusText || "Error al cargar el historial.");
        }
        setLoading(false);
      });
    }
  }, [clienteId, url]);

  return (
    <div
      className="modal fade"
      id={`historialModal-${clienteId}`}
      tabIndex="-1"
      aria-labelledby={`historialModalLabel-${clienteId}`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`historialModalLabel-${clienteId}`}>
              Historial de Pedidos - {clienteNombre}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {loading && <p className="text-center">Cargando historial...</p>}
            {error && <div className="alert alert-danger text-center">{error}</div>}
            {!loading && historial.length === 0 && !error && (
              <p className="text-center">No hay pedidos en el historial para este cliente.</p>
            )}
            {historial.length > 0 && (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID Pedido</th>
                      <th>Fecha Pedido</th>
                      <th>Fecha Entrega</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Detalles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((pedido) => (
                      <tr key={pedido.id}>
                        <td>{pedido.id}</td>
                        <td>{pedido.fechaPedido}</td>
                        <td>{pedido.fechaEntrega}</td>
                        <td>${pedido.total ? pedido.total.toFixed(2) : "0.00"}</td>
                        <td>{pedido.estado}</td>
                        <td>
                          {pedido.detallePedidos && pedido.detallePedidos.length > 0 ? (
                            <ul className="list-unstyled mb-0">
                              {pedido.detallePedidos.map((detalle) => (
                                <li key={detalle.id}>
                                  <strong>{detalle.lote?.producto?.nombre || "Producto Desconocido"}</strong>{" "}
                                  (Lote: {detalle.lote?.codigoLote || "N/A"}) – Cant: {detalle.cantidad}, Subtotal: $
                                  {detalle.subtotal ? detalle.subtotal.toFixed(2) : "0.00"}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span>No hay detalles de productos.</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
