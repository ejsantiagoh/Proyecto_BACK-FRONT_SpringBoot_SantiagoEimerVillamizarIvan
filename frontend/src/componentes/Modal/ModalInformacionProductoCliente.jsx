import React from 'react';

export const ModalInformacionProductoCliente = ({
  formatCurrency,
  id,
  selectedDetail,
  orderTotal,
  orderEstado,
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  return (
    <>
      <div
        className="modal fade"
        id={id}
        tabIndex="-1"
        aria-labelledby="detailModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="detailModalLabel">
                Detalles del Ítem de Pedido
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body">
              {selectedDetail && (
                <div>
                  <h5>Información del Producto</h5>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p>
                        <strong>Nombre:</strong>{' '}
                        {selectedDetail.lote.producto.nombre}
                      </p>
                      <p>
                        <strong>Descripción:</strong>{' '}
                        {selectedDetail.lote.producto.descripcion}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Precio Unitario:</strong>{' '}
                        {formatCurrency(selectedDetail.lote.producto.precio)}
                      </p>
                    </div>
                  </div>

                  <h5>Detalles del Pedido</h5>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p>
                        <strong>Cantidad Pedida:</strong>{' '}
                        {selectedDetail.cantidad}
                      </p>
                      <p>
                        <strong>Subtotal:</strong>{' '}
                        {formatCurrency(selectedDetail.subtotal)}
                      </p>
                      <p>
                        <strong>Fecha de Entrega:</strong>{' '}
                        {formatDate(selectedDetail.fechaEntrega)}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Total Pedido:</strong>{' '}
                        {formatCurrency(orderTotal)}
                      </p>
                      <p>
                        <strong>Estado Pedido:</strong> {orderEstado}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
