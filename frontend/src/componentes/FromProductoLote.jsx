import React, { useEffect, useState } from "react";

const initialForm = {
  id: null,
  codigo_lote: "",
  fecha_produccion: "",
  producto_id: "",
  cantidad: "",
  estado: "",
};

export const FromProductoLote = ({
  createData,
  updateData,
  patchData,
  dataToEdit,
  setdataToEdit,
  isModal = false,
}) => {
  const [form, setform] = useState(initialForm);
  const [validationError, setValidationError] = useState(null); // Nuevo estado para errores de validación

  useEffect(() => {
    if (dataToEdit && isModal) {
      console.log("Editando en modal:", dataToEdit);
      setform({
        id: dataToEdit.id,
        codigo_lote: dataToEdit.codigoLote,
        fecha_produccion: dataToEdit.fechaProduccion,
        producto_id: dataToEdit.producto.id,
        cantidad: dataToEdit.cantidad,
        estado: dataToEdit.estado,
      });
    } else {
      setform(initialForm);
      setValidationError(null); // Limpiar error cuando no se edita
    }
  }, [dataToEdit, isModal]);

  const handleChange = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario actual:", form);

    // Validaciones
    if (
      !form.codigo_lote ||
      !form.fecha_produccion ||
      !form.producto_id ||
      !form.cantidad ||
      !form.estado
    ) {
      setValidationError("Por favor, complete todos los campos.");
      return;
    }
    setValidationError(null); // Limpiar errores si todo está bien

    // Lógica para el formulario que NO es modal (el de creación)
    if (!isModal) {
      const formattedData = {
        codigoLote: form.codigo_lote,
        fechaProduccion: form.fecha_produccion,
        producto: {
          id: parseInt(form.producto_id),
        },
        cantidad: parseInt(form.cantidad),
        estado: form.estado,
      };

      console.log("Datos enviados para creación:", formattedData);
      createData(formattedData); // Llama a createData, que ahora oculta el formulario en AdminLotes
      handleReset(); // Limpia el formulario después de enviar
    } else {
      // Si es un modal, esto debería ser manejado por updateData o patchData
      // según el contexto de tu aplicación.
      // Actualmente, el modal solo tiene la opción de cambiar a "Defectuoso" y llama a patchData.
      // Si el modal fuera para actualizar todos los campos, la lógica aquí cambiaría.
    }
  };

  const handlePatch = () => {
    if (!form.id) {
      alert("No se puede actualizar: ID del lote no definido.");
      return;
    }

    // El patchData en AdminLotes ya recibe el ID y el cuerpo del PATCH (res.body).
    // Tu `patchData` en `AdminLotes` ya lo espera así: `patchData(id, options.body)`.
    // Sin embargo, tu función `patchData` en `AdminLotes` solo espera el `id` y asume el estado "Defectuoso"
    // dentro de esa función. Vamos a mantener la consistencia con lo que ya tienes.
    // Solo necesitas pasar el ID.

    patchData(form.id); // Llamar a patchData con solo el ID, como lo espera AdminLotes

    // No reseteamos el formulario aquí ya que el modal se cerrará automáticamente
    // después de la actualización exitosa en AdminLotes.
  };

  const handleReset = () => {
    setform(initialForm);
    setdataToEdit(null);
    setValidationError(null); // Limpiar errores al resetear
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {validationError && ( // Mostrar errores de validación aquí
        <div className="alert alert-danger mb-3" role="alert">
          {validationError}
        </div>
      )}
      {isModal ? (
        // Formulario del modal: solo el select de estado y botón Actualizar
        <div className="mb-3">
          <label htmlFor="estado" className="form-label">
            Estado
          </label>
          <div className="input-group">
            <select
              className="form-select"
              id="estado"
              required
              name="estado"
              value={form.estado}
              onChange={handleChange}
              // Si el estado es "Vendido" o "Defectuoso", deshabilita el select
              disabled={form.estado === "Vendido" || form.estado === "Defectuoso"}
            >
              {/* Opciones disponibles si el estado actual es "Disponible" o nulo */}
              {form.estado === "Disponible" || !form.estado ? (
                <option value="Defectuoso">Defectuoso</option>
              ) : (
                // Mostrar el estado actual si no es "Disponible"
                <option value={form.estado}>{form.estado}</option>
              )}
            </select>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handlePatch}
              // Deshabilita el botón si el estado ya es "Vendido" o "Defectuoso"
              disabled={form.estado === "Vendido" || form.estado === "Defectuoso"}
            >
              Actualizar
            </button>
          </div>
        </div>
      ) : (
        // Formulario inicial: todos los campos
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="codigo_lote" className="form-label">
                Código de Lote
              </label>
              <input
                type="text"
                className="form-control"
                id="codigo_lote"
                placeholder="Ej: L005"
                value={form.codigo_lote}
                name="codigo_lote"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fecha_produccion" className="form-label">
                Fecha de Producción
              </label>
              <input
                type="date"
                className="form-control"
                id="fecha_produccion"
                value={form.fecha_produccion}
                name="fecha_produccion"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="producto_id" className="form-label">
                Tipo de Producto
              </label>
              <select
                className="form-select"
                id="producto_id"
                value={form.producto_id}
                name="producto_id"
                onChange={handleChange}
              >
                <option value="">Seleccione</option>
                <option value="1">Atún en aceite</option>
                <option value="2">Atún en agua</option>
                <option value="3">Atún en salsa</option>
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="cantidad" className="form-label">
                Cantidad Producida
              </label>
              <input
                type="number"
                className="form-control"
                id="cantidad"
                name="cantidad"
                value={form.cantidad}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="estado" className="form-label">
                Estado
              </label>
              <select
                className="form-select"
                id="estado"
                name="estado"
                value={form.estado}
                onChange={handleChange}
              >
                <option value="">Seleccione</option>
                <option value="Disponible">Disponible</option>
                <option value="Vendido">Vendido</option>
                <option value="Defectuoso">Defectuoso</option>
              </select>
            </div>
          </div>
          <div className="d-grid mt-3">
            <button type="submit" className="btn btn-dark fw-semibold">
              Registrar Lote
            </button>
            <button
              type="button"
              className="btn btn-secondary mt-2"
              onClick={handleReset}
            >
              Limpiar Campos
            </button>
          </div>
        </div>
      )}
    </form>
  );
};