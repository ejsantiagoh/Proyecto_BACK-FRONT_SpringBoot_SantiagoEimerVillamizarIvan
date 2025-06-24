import React, { useEffect, useState } from "react";
import { Table } from "../../componentes/Table";
import { helpHttp } from "../../helps/helpHttp";
import { FromProductoLote } from "../../componentes/FromProductoLote";
import { Louder } from "../../componentes/Louder";
import { Message } from "../../componentes/Message"; // Importar Message para mostrar mensajes de éxito/error

export const AdminLotes = () => {
  const [db, setdb] = useState(null);
  const [dataToEdit, setdataToEdit] = useState(null);
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null); // Nuevo estado para mensajes de éxito
  const [showForm, setShowForm] = useState(false); // Nuevo estado para controlar la visibilidad del formulario

  // Estados para los filtros
  const [filterTipo, setFilterTipo] = useState("");
  const [filterFecha, setFilterFecha] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  let api = helpHttp();
  let url = "http://localhost:8081/api/operador/lotes";

  useEffect(() => {
    setloading(true);
    api.get(url).then((res) => {
      if (!res.err) {
        setdb(res);
        seterror(null);
      } else {
        setdb(null);
        seterror(res);
      }
      setloading(false);
    });
  }, [url]);

  // Función para filtrar los datos
  const filteredData = db
    ? db.filter((item) => {
        let matchesTipo = true;
        let matchesFecha = true;
        let matchesEstado = true;

        if (filterTipo) {
          matchesTipo = item.producto.id === parseInt(filterTipo);
        }
        if (filterFecha) {
          matchesFecha = item.fechaProduccion === filterFecha;
        }
        if (filterEstado) {
          matchesEstado = item.estado === filterEstado;
        }

        return matchesTipo && matchesFecha && matchesEstado;
      })
    : [];

  // Función para limpiar los filtros
  const handleClearFilters = () => {
    setFilterTipo("");
    setFilterFecha("");
    setFilterEstado("");
  };

  const createData = (data) => {
    let options = {
      body: data,
      headers: { "content-type": "application/json" },
    };

    api.post(url, options).then((res) => {
      if (!res.err) {
        setdb([...db, res]);
        setSuccessMessage("Lote registrado exitosamente.");
        setShowForm(false); // Ocultar el formulario después de un registro exitoso
      } else {
        const message =
          typeof res.body === "string"
            ? res.body
            : res.body?.message || "Error desconocido al registrar lote.";
        seterror(message);
      }
      setTimeout(() => {
        seterror(null);
        setSuccessMessage(null);
      }, 4000);
    });
  };

  const updateData = (data) => {
    let endpoint = `${url}/${data.id}`;
    let options = {
      body: data,
      headers: { "content-type": "application/json" },
    };

    api.put(endpoint, options).then((res) => {
      if (!res.err) {
        let newData = db.map((el) => (el.id === data.id ? res : el));
        setdb(newData);
        setSuccessMessage("Lote actualizado exitosamente.");
      } else {
        const message =
          typeof res.body === "string"
            ? res.body
            : res.body?.message || "Error desconocido al actualizar lote.";
        seterror(message);
      }
      setTimeout(() => {
        seterror(null);
        setSuccessMessage(null);
      }, 4000);
    });
  };

  const patchData = (id) => {
    let endpoint = `${url}/${id}/defectuoso`;
    let options = {
      headers: { "content-type": "application/json" },
    };
    console.log(options, "opciones");
    api.patch(endpoint, options).then((res) => {
      console.log(res, "respuesta");
      if (!res.err) {
        let newData = db.map((el) => (el.id === id ? { ...el, ...res } : el));
        setdb(newData);
        setSuccessMessage("Lote marcado como defectuoso exitosamente.");
        const modal = window.bootstrap.Modal.getInstance(
          document.getElementById("editLoteModal")
        );
        if (modal) modal.hide();
      } else {
        const message =
          typeof res.body === "string"
            ? res.body
            : res.body?.message || "Error desconocido al marcar lote como defectuoso.";
        seterror(message);
      }
      setTimeout(() => {
        seterror(null);
        setSuccessMessage(null);
      }, 4000);
    });
  };

  const deleteData = (id) => {
    let options = {
      headers: { "content-type": "application/json" },
    };

    let isDelete = window.confirm(
      `¿Estás seguro de eliminar el registro con el id ${id}?`
    );
    if (isDelete) {
      let endpoint = `${url}/${id}`;
      api.del(endpoint, options).then((res) => {
        if (!res.err) {
          let newData = db.filter((el) => el.id !== id);
          setdb(newData);
          setSuccessMessage("Lote eliminado exitosamente.");
        } else {
          const message =
            typeof res.body === "string"
              ? res.body
              : res.body?.message || "Error desconocido al eliminar lote.";
          seterror(message);
        }
        setTimeout(() => {
          seterror(null);
          setSuccessMessage(null);
        }, 4000);
      });
    }
  };

  const renderRow = ({ item, modalId }) => (
    <tr key={item.id}>
      <td>{item.codigoLote}</td>
      <td>{item.fechaProduccion}</td>
      <td>{item.producto.nombre}</td>
      <td>{item.cantidad}</td>
      <td>
        <span
          className={`badge ${
            item.estado === "Disponible"
              ? "text-bg-success"
              : item.estado === "Vendido"
              ? "text-bg-primary"
              : item.estado === "Defectuoso"
              ? "text-bg-danger"
              : "text-bg-secondary"
          }`}
        >
          {item.estado}
        </span>
      </td>
      <td>
        {item.estado !== "Vendido" && item.estado !== "Defectuoso" ? (
          <button
            onClick={() => {
              setdataToEdit(item);
              const modal = new window.bootstrap.Modal(
                document.getElementById(modalId)
              );
              modal.show();
            }}
            className="ms-3 mt-1 fas fa-edit border border-0 text-primary"
          ></button>
        ) : (
          <span></span>
        )}
        <button
          onClick={() => deleteData(item.id)}
          className="ms-3 mt-1 fas fa-trash-alt border border-0 text-danger"
        ></button>
      </td>
    </tr>
  );

  return (
    <>
      <div className="text-center mb-5 mt-3">
        <h1 className="fw-bold">Gestión de Lotes de Producción</h1>
        <p className="text-muted">
          Registrar, consultar y marcar productos defectuosos
        </p>
      </div>

      {loading && <Louder />}
      {error && <Message msg={error} bgColor="alert-danger" />}
      {successMessage && <Message msg={successMessage} bgColor="alert-success" />}

      <div className="container mt-3">
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-success"
            onClick={() => {
              setShowForm(!showForm); // Alternar la visibilidad del formulario
              setdataToEdit(null); // Asegurarse de limpiar el estado de edición al abrir el form de registro
            }}
          >
            {showForm ? "Ocultar Formulario" : "Registrar Nuevo Lote"}
          </button>
        </div>

        {showForm && ( // Renderiza el FromProductoLote solo si showForm es true
          <div className="card mb-4">
            <div className="card-header">
              <h3>{dataToEdit ? "Editar Lote" : "Registrar Nuevo Lote"}</h3>
            </div>
            <div className="card-body">
              <FromProductoLote
                createData={createData}
                updateData={updateData}
                patchData={patchData}
                dataToEdit={dataToEdit}
                setdataToEdit={setdataToEdit}
                isModal={false} // Este formulario no es un modal
              />
            </div>
          </div>
        )}

        {/* Sección de Filtros */}
        {db && (
          <div className="card mb-4">
            <div className="card-header">Filtros de Búsqueda</div>
            <div className="card-body">
              <form>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="filterTipo" className="form-label">
                      Tipo de Producto
                    </label>
                    <select
                      className="form-select"
                      id="filterTipo"
                      value={filterTipo}
                      onChange={(e) => setFilterTipo(e.target.value)}
                    >
                      <option value="">Todos</option>
                      <option value="1">Atún en aceite</option>
                      <option value="2">Atún en agua</option>
                      <option value="3">Atún en salsa</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="filterFecha" className="form-label">
                      Fecha de Producción
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="filterFecha"
                      value={filterFecha}
                      onChange={(e) => setFilterFecha(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="filterEstado" className="form-label">
                      Estado
                    </label>
                    <select
                      className="form-select"
                      id="filterEstado"
                      value={filterEstado}
                      onChange={(e) => setFilterEstado(e.target.value)}
                    >
                      <option value="">Todos</option>
                      <option value="Disponible">Disponible</option>
                      <option value="Vendido">Vendido</option> {/* Corregido el valor */}
                      <option value="Defectuoso">Defectuoso</option> {/* Corregido el valor */}
                    </select>
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClearFilters}
                  >
                    Limpiar Filtros
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabla con datos filtrados */}
        {loading ? (
          <Louder />
        ) : (
          db && (
            <Table
              deleteData={deleteData}
              data={filteredData}
              nombreTabla={"Lotes de producción"}
              setdataToEdit={setdataToEdit}
              tableHeader={[
                "Código Lote",
                "Fecha de Producción",
                "Tipo de Producto",
                "Cantidad Producida",
                "Estado",
                "Acción",
              ]}
              modalId="editLoteModal"
              modalFormComponent={
                <FromProductoLote
                  createData={createData}
                  updateData={updateData}
                  patchData={patchData}
                  dataToEdit={dataToEdit}
                  setdataToEdit={setdataToEdit}
                  isModal={true}
                />
              }
              renderRow={renderRow}
            />
          )
        )}
      </div>
    </>
  );
};