import { useState } from 'react';
import { helpHttp } from '../../helps/helpHttp';

export const ModalClintePedido = ({ modalId, producto, onClose, modalRef, idCliente }) => {
  const [cantidad, setCantidad] = useState(1);
  const api = helpHttp();

  const handleCantidadChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setCantidad(value);
  };

  const handleRealizarPedido = () => {
    const pedidoData = {
      cliente: {
        id: idCliente // ID fijo; cámbialo si es dinámico
      },
      detallePedidos: [
        {
          producto: {
            nombre: producto.nombre // Asumimos que el ID del producto es el ID del lote
          },
          
          cantidad: cantidad,
          
        }
      ],
      estado: 'Pendiente'
    };

    api.post('http://localhost:8081/api/cliente/pedidos', 
      { body: pedidoData, 
        headers: { "content-type": "application/json" }, 
      })
    .then((res) => {
      if (!res.err) {
        alert(`¡Pedido de ${cantidad} unidades de ${producto.nombre} realizado con éxito!`);
      } else {
        const parsedBody = JSON.parse(res.body);
        const mensaje = parsedBody.message;
        console.log(mensaje, " mensaje");
        alert(`Error al realizar el pedido: ${mensaje || 'Inténtalo de nuevo.'}`);
      }
      onClose(); // Cerrar el modal tras enviar el pedido
    });
  };

  return (
    <div
      className="modal fade"
      id={modalId}
      tabIndex="-1"
      aria-labelledby={`${modalId}-label`}
      aria-hidden="true"
      ref={modalRef}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${modalId}-label`}>
              Detalles del producto
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              <strong>Nombre:</strong> {producto.nombre}
            </p>
            <p>
              <strong>Descripción:</strong> {producto.descripcion}
            </p>
            <p>
              <strong>Precio unitario:</strong> ${producto.precio.toFixed(2)}
            </p>
            <p>
              <strong>Lote:</strong> {producto.id}
            </p>
            <div className="mb-3">
              <label className="form-label">Cantidad</label>
              <input
                type="number"
                className="form-control"
                value={cantidad}
                onChange={handleCantidadChange}
                min={1}
              />
            </div>
            <p>
              <strong>Precio total:</strong> ${(producto.precio * cantidad).toFixed(2)}
            </p>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-success"
              onClick={handleRealizarPedido}
              data-bs-dismiss="modal"
            >
              Realizar pedido
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};