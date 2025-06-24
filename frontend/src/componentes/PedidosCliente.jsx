import React, { useState } from "react";
import { ModalClintePedido } from "./Modal/ModalDetallePedido";

export const ProductoCard = ({ producto }) => {

  const precioTotal = producto.precio * cantidad;
  const modalId = `modal-${producto.id}`;
  return (
    <>
      {/* Card */}
      <div className="card m-2 shadow" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">{producto.nombre}</h5>
          <p className="card-text">{producto.descripcion}</p>
          <p className="card-text fw-bold">Precio: ${producto.precio}</p>
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target={`#${modalId}`}
          >
            Ver detalles
          </button>
        </div>
      </div>

      {/* Modal */}
      <ModalClintePedido modalId={modalId}  producto={producto} precioTotal={precioTotal} />
    </>
  );
};

