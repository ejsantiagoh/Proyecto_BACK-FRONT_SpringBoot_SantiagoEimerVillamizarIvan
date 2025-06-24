// componentes/FormRegistro.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const FormRegistro = ({
  createData,
  updateData,
  dataToEdit,
  setDataToEdit,
  isModal
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isOperador = location.pathname === "/admin/operadores";
  const isCliente  = location.pathname === "/admin/clientes";
  const isRegistro = location.pathname === "/registro";

  // Valores iniciales del formulario
  const initialForm = {
    id:            null,
    username:      '',
    correo:        '',
    password:      '',
    rolId:         isOperador ? 2 : 3,
    identificacion:'',
    telefono:      '',
    direccion:     '',
    estado:        isCliente ? 'Activo' : undefined,
  };

  const [form, setForm] = useState(initialForm);
  const [validationError, setValidationError] = useState(null);

  // Cuando entra dataToEdit, cargamos el form según tipo de ruta
  useEffect(() => {
    if (dataToEdit) {
      if (isOperador) {
        // dataToEdit = { id, username, correo, rol: { id, nombre } }
        setForm({
          id:            dataToEdit.id,
          username:      dataToEdit.username || '',
          correo:        dataToEdit.correo   || '',
          password:      '',                  // no cargamos contraseña
          rolId:         dataToEdit.rol?.id  || 2,
          identificacion:'',
          telefono:      '',
          direccion:     '',
          estado:        undefined,
        });
      } else {
        // Cliente: dataToEdit has cliente fields + usuario nested
        setForm({
          id:            dataToEdit.usuario?.id        || null,
          username:      dataToEdit.usuario?.username  || '',
          correo:        dataToEdit.usuario?.correo    || '',
          password:      '',                            // no cargamos contraseña
          rolId:         dataToEdit.usuario?.rol?.id   || 3,
          identificacion:dataToEdit.identificacion     || '',
          telefono:      dataToEdit.telefono           || '',
          direccion:     dataToEdit.direccion          || '',
          estado:        dataToEdit.estado             || 'Activo',
        });
      }
    } else {
      setForm(initialForm);
    }
  }, [dataToEdit, isOperador, isCliente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!form.username || !form.correo || (!dataToEdit && !form.password)) {
      setValidationError('Complete los campos obligatorios.');
      return;
    }
    if (!isOperador && (!form.identificacion || !form.telefono || !form.direccion)) {
      setValidationError('Complete todos los campos de cliente.');
      return;
    }
    setValidationError(null);

    const finalData = { ...form };

    if (dataToEdit) {
      updateData(finalData);
    } else {
      createData(finalData);
    }

    // Reset y cierre de modal opcional
    setForm(initialForm);
    setDataToEdit(null);
    if (isModal) {
      const modalEl = document.getElementById(isOperador ? 'editOperadorModal' : 'editClienteModal');
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  };

  const handleVolver = () => navigate('/');

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {validationError && <div className="alert alert-danger">{validationError}</div>}

      {/* Usuario y correo y password */}
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              name="username"
              type="text"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              name="correo"
              type="email"
              className="form-control"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </div>
          {!dataToEdit && (
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                name="password"
                type="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          )}
        </div>

        {/* Campos solo para clientes (identificacion, teléfono, dirección, estado) */}
        {!isOperador && (
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Identificación</label>
              <input
                name="identificacion"
                type="text"
                className="form-control"
                value={form.identificacion}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Teléfono</label>
              <input
                name="telefono"
                type="text"
                className="form-control"
                value={form.telefono}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                name="direccion"
                type="text"
                className="form-control"
                value={form.direccion}
                onChange={handleChange}
                required
              />
            </div>
            {isCliente && (
              <div className="mb-3">
                <label className="form-label">Estado</label>
                <select
                  name="estado"
                  className="form-select"
                  value={form.estado}
                  onChange={handleChange}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="d-grid gap-2">
        <button type="submit" className="btn btn-dark fw-semibold">
          {dataToEdit ? 'Actualizar' : 'Registrar'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => {
          setForm(initialForm);
          setDataToEdit(null);
        }}>
          Limpiar
        </button>
        {isRegistro && (
          <button type="button" className="btn btn-outline-secondary" onClick={handleVolver}>
            Volver
          </button>
        )}
      </div>
    </form>
  );
};
