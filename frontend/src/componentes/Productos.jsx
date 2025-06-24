import React, { useState, useEffect, useRef } from 'react';
import { ModalClintePedido } from './Modal/ModalClintePedido';


export const Productos = ({ productos, idCliente }) => {
  const [selectedProducto, setSelectedProducto] = useState(null);
  const modalRef = useRef(null);

  const openModal = (producto) => {
    setSelectedProducto(producto);
  };

  const closeModal = () => {
    setSelectedProducto(null);
  };

  useEffect(() => {
    if (selectedProducto && modalRef.current) {
      // Inicializar el modal de Bootstrap manualmente
      const modal = new window.bootstrap.Modal(modalRef.current, {
        backdrop: true,
        keyboard: true,
      });
      modal.show();

      // Limpiar al desmontar o cerrar
      return () => {
        modal.hide();
      };
    }
  }, [selectedProducto]);

  return (
    <>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {productos.map((producto) => (
          <div className="col" key={producto.id}>
            <div className="card h-100 shadow-sm">
              <div className="image-container">
                <img
                  src={producto.imagen}
                  className="card-img-top"
                  alt={producto.nombre}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text">{producto.descripcion}</p>
                <p className="card-text fw-bold text-primary">${producto.precio.toFixed(2)}</p>
                <button
                  className="btn btn-success w-100"
                  onClick={() => openModal(producto)}
                >
                  Realizar Pedido
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedProducto && (
        <ModalClintePedido
          modalId="modal-pedido"
          producto={selectedProducto}
          onClose={closeModal}
          modalRef={modalRef}
          idCliente={idCliente}
        />
      )}
    </>
  );
};