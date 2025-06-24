// AdminClientes.jsx
import React, { useContext, useEffect, useState } from "react";
import { Table } from "../../componentes/Table";
import { FormRegistro } from "../../componentes/FormRegistro";
import { helpHttp } from "../../helps/helpHttp";
import { Message } from "../../componentes/Message";
import { HistorialModal } from "../../componentes/Modal/HistorialModal";
import { AuthContext } from "../../componentes/AuthContext";

export const AdminClientes = () => {
  const { user } = useContext(AuthContext);
  const [db, setDb] = useState(null);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const api = helpHttp();
  const url = "http://localhost:8081/api/admin/clientes";

  // 🔁 Esta función centraliza la carga de los clientes
  const fetchClientes = () => {
    setLoading(true);
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
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const createData = (data) => {
    api.post(url, {
      body: data,
      headers: { "content-type": "application/json" },
    }).then((res) => {
      if (!res.err) {
        setSuccessMessage("Usuario creado exitosamente.");
        fetchClientes();
        setShowForm(false);
      } else {
        setError(res.body?.message || "Error al crear usuario.");
      }
      setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 4000);
    });
  };

const updateData = (data) => {
  const id = data.id;
  if (!id) {
    setError("No se encontró el ID del usuario para actualizar.");
    return;
  }

  const endpoint = `http://localhost:8081/api/auth/admin/usuarios/${id}`;
  const options = {
    body: data,
    headers: { "Content-Type": "application/json" },
  };

  api.patch(endpoint, options).then((res) => {
    if (!res.err) {
      setSuccessMessage("Usuario actualizado exitosamente.");
      fetchClientes(); // 🔁 Volver a cargar los datos actualizados
    } else {
      const message =
        typeof res.body === "string"
          ? res.body
          : res.body?.message || "Error desconocido al actualizar usuario.";
      setError(message);
    }

    setTimeout(() => {
      setError(null);
      setSuccessMessage(null);
    }, 4000);
  });
};



  const deleteData = (id) => {
    const isDelete = window.confirm(`¿Eliminar cliente con ID ${id}?`);
    if (isDelete) {
      api.del(`${url}/${id}`, {
        headers: { "content-type": "application/json" },
      }).then((res) => {
        if (!res.err) {
          setSuccessMessage("Usuario eliminado.");
          fetchClientes(); // Refrescar datos de clientes
        } else {
          setError(res.body?.message || "Error al eliminar usuario.");
        }
        setTimeout(() => {
          setError(null);
          setSuccessMessage(null);
        }, 4000);
      });
    }
  };

  const renderRow = ({ item, modalId }) => (
    <tr key={item.id}>
      <td>{item.nombre}</td>
      <td>{item.identificacion}</td>
      <td>{item.telefono}</td>
      <td>{item.direccion}</td>
      <td>
        <span className={`badge ${item.estado === "Activo" ? "text-bg-success" : "text-bg-secondary"}`}>
          {item.estado}
        </span>
      </td>
      <td>
        <button
          type="button"
          className="btn btn-info btn-sm"
          data-bs-toggle="modal"
          data-bs-target={`#historialModal-${item.id}`}
        >
          Ver Historial
        </button>
      </td>
      <td>
        <button
          onClick={() => {
            setDataToEdit(item);
            const modal = new window.bootstrap.Modal(document.getElementById(modalId));
            modal.show();
          }}
          className="ms-3 mt-1 fas fa-edit border border-0 text-primary"
        ></button>
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
        <h1 className="fw-bold">Gestión de Clientes</h1>
        <p className="text-muted">Administra los usuarios de Autunes del Pacífico</p>
      </div>

      {loading && <p className="text-center">Cargando clientes...</p>}
      {error && <Message msg={error} bgColor="alert-danger" />}
      {successMessage && <Message msg={successMessage} bgColor="alert-success" />}

      <div className="container mt-3">
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-success"
            onClick={() => {
              setShowForm(!showForm);
              setDataToEdit(null);
            }}
          >
            {showForm ? "Ocultar Formulario" : "Registrar Nuevo Cliente"}
          </button>
        </div>

        {showForm && (
          <div className="card mb-4">
            <div className="card-header">
              <h3>{dataToEdit ? "Editar Cliente" : "Registrar Nuevo Cliente"}</h3>
            </div>
            <div className="card-body">
              <FormRegistro
                createData={createData}
                updateData={updateData}
                dataToEdit={dataToEdit}
                setDataToEdit={setDataToEdit}
                isModal={false}
              />
            </div>
          </div>
        )}

        {db && (
          <>
            {db.map((item) => (
              <HistorialModal
                key={item.id}
                clienteId={item.id}
                clienteNombre={item.nombre}
              />
            ))}
            <Table
              deleteData={deleteData}
              data={db}
              nombreTabla={"Clientes Registrados"}
              setDataToEdit={setDataToEdit}
              tableHeader={[
                "Nombre",
                "Identificación",
                "Teléfono",
                "Dirección",
                "Estado",
                "Historial",
                "Acción",
              ]}
              modalId="editClienteModal"
              modalFormComponent={
                <FormRegistro
                  createData={createData}
                  updateData={updateData}
                  dataToEdit={dataToEdit}
                  setDataToEdit={setDataToEdit}
                  isModal={true}
                />
              }
              renderRow={renderRow}
            />
          </>
        )}
      </div>
    </>
  );
};
