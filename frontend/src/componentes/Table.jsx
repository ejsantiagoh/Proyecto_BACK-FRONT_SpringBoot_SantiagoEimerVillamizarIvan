import React, { useState } from "react";
import { ModalForm } from "./Modal/ModalForm";

export const Table = ({
  nombreTabla,
  tableHeader,
  data,
  renderRow, // Función o componente para renderizar las filas
  modalId, // ID del modal para el formulario de edición
  modalFormComponent, // Componente del formulario para el modal
  usersPerPage = 3, // Número de filas por página, con un valor por defecto
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Lógica de Paginación
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentData = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / usersPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {modalFormComponent && <ModalForm id={modalId} Componente={modalFormComponent} />}
      <div className="container my-5">
        <div className="card">
          <div className="card-header">Tabla de {nombreTabla}</div>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  {tableHeader.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item) =>
                    renderRow({ item, modalId })
                  )
                ) : (
                  <tr>
                    <td colSpan={tableHeader.length} className="text-center">
                      No hay datos para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Sección de Paginación de Bootstrap */}
          {totalPages > 1 && ( // Solo muestra la paginación si hay más de una página
            <div className="card-footer d-flex justify-content-center">
              <nav aria-label="Navegación de páginas">
                <ul className="pagination mb-0">
                  {/* Botón "Anterior" */}
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Anterior"
                    >
                      &laquo;
                    </button>
                  </li>

                  {/* Números de Página */}
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                      key={i}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  {/* Botón "Siguiente" */}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Siguiente"
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
};