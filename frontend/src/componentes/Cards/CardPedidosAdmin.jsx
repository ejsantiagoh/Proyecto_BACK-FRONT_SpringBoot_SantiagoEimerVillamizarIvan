import { useState } from "react";

// import { ModalClintePedido } from "./Modal/ModalDetallePedido";
import { ModalClintePedido } from "../Modal/ModalClintePedido";

export const CardPedidosAdmin = ({ data }) => {
  // const agrupado = {};

  // db.forEach((item) => {
  //   const producto = item.lote.producto;
  //   const id = producto.id;

  //   if (!agrupado[id]) {
  //     agrupado[id] = {
  //       ...producto,
  //       cantidadTotal: item.cantidad,
  //       subtotalTotal: item.subtotal,
  //     };
  //   } else {
  //     agrupado[id].cantidadTotal += item.cantidad;
  //     agrupado[id].subtotalTotal += item.subtotal;
  //   }
  // });

  // console.log(Object.values(agrupado))

  return (
    <>
      {/* <ModalClintePedido modalId="detallePedido" data={data} /> */}

      <div className="row">
        <div className="col-sm-6 mb-4 col-lg-4">
          <div className="card  rounded-4 border-0">
            <div className="card-body">
              <ul className="list-unstyled mb-4">
                <li>
                  <strong>Cliente:</strong> {data.cliente.nombre}
                </li>
                <li>
                  <strong>fechaPedido:</strong> {data.fechaPedido}
                </li>
                <li>
                  <strong>fechaEntrega:</strong> {data.fechaEntrega}
                </li>
                <li>
                  <strong>total:</strong> {data.total}
                </li>
                <li>
                  <strong>Estado:</strong>{" "}
                  <span className="badge bg-warning text-dark">
                    {data.estado}{" "}
                  </span>
                </li>
              </ul>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="detallePedido"
              >
                Ver detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
