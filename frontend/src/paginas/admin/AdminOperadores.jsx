// AdminOperadores.jsx
import React, { useEffect, useState } from "react";
import { Table } from "../../componentes/Table";
import { FormRegistro } from "../../componentes/FormRegistro";
import { helpHttp } from "../../helps/helpHttp";
import { Message } from "../../componentes/Message";

export const AdminOperadores = () => {
  const [db, setDb] = useState(null);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const api = helpHttp();
  const url = "http://localhost:8081/api/auth/admin/usuarios";

  useEffect(() => {
    api.get(url).then((res) => {
      if (!res.err) {
        // Filtrar solo operadores
        const operadores = res.filter((u) => u.rol.nombre === "Operador");
        setDb(operadores);
        setError(null);
      } else {
        setDb(null);
        setError(res);
      }
      setLoading(false);
    });
  }, []);

  const createData = (data, customUrl) => {
    const endpoint = customUrl || url;
    const options = {
      body: data,
      headers: { "Content-Type": "application/json" },
    };

    api.post(endpoint, options).then((res) => {
      if (!res.err) {
        setSuccessMessage("Operador registrado correctamente.");
        setDb([...db, res]);
        setShowForm(false);
      } else {
        setError(res.body?.message || "Error al registrar operador.");
      }
      setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 4000);
    });
  };

  const updateData = (data) => {
    console.log( "datosss ",data)
    const endpoint = `${url}/${data.id}`;
    const options = {
      body: data,
      headers: { "Content-Type": "application/json" },
    };

    api.patch(endpoint, options).then((res) => {
      if (!res.err) {
        const newData = db.map((el) => (el.id === data.id ? res : el));
        setDb(newData);
        setSuccessMessage("Operador actualizado correctamente.");
      } else {
        console.log("Error al actualizar operador:", res);
        setError(res.body?.message || "Error al actualizar operador.");
      }
      setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 4000);
    });
  };

  const deleteData = (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este operador?")) return;
    const endpoint = `${url}/${id}`;
    const options = {
      headers: { "Content-Type": "application/json" },
    };

    api.del(endpoint, options).then((res) => {
      if (!res.err) {
        const newData = db.filter((el) => el.id !== id);
        setDb(newData);
        setSuccessMessage("Operador eliminado correctamente.");
      } else {
        setError(res.body?.message || "Error al eliminar operador.");
      }
      setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 4000);
    });
  };

  const renderRow = ({ item, modalId }) => (
    <tr key={item.id}>
      <td>{item.username}</td>
      <td>{item.correo}</td>
      <td>
        <span className="badge text-bg-success">{item.rol.nombre}</span>
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
    <div className="container mt-3">
      <div className="text-center mb-4">
        <h1 className="fw-bold">Gestión de Operadores</h1>
        <p className="text-muted">Administra usuarios con rol Operador</p>
      </div>

      {loading && <p className="text-center">Cargando operadores...</p>}
      {error && <Message msg={error} bgColor="alert-danger" />}
      {successMessage && <Message msg={successMessage} bgColor="alert-success" />}

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-success"
          onClick={() => {
            setShowForm(!showForm);
            setDataToEdit(null);
          }}
        >
          {showForm ? "Ocultar Formulario" : "Registrar Operador"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h3>{dataToEdit ? "Editar Operador" : "Registrar Operador"}</h3>
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
        <Table
          data={db}
          deleteData={deleteData}
          nombreTabla="Operadores"
          tableHeader={["Nombre de usuario", "Correo", "Rol", "Acción"]}
          setDataToEdit={setDataToEdit}
          modalId="editOperadorModal"
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
      )}
    </div>
  );
};
