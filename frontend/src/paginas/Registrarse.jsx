import React, { useState } from "react";
import { FormRegistro } from "../componentes/FormRegistro";
import { helpHttp } from "../helps/helpHttp";
import { Message } from "../componentes/Message";

const initialForm = {
  correo: "",
  direccion: "",
  estado: "",
  id: null,
  password: "",
  identificacion: "",
  nombre: "",
  telefono: "",
};

export const Registrarse = () => {
  const [db, setdb] = useState(null);
  const [dataToEdit, setdataToEdit] = useState(null);
  const [error, seterror] = useState(null);
  const [correcto, setcorrecto] = useState(null);

  const [form, setform] = useState(initialForm);

  let api = helpHttp();
  let url = "http://localhost:8081/api/auth/register";

  const createData = (data) => {
    let options = {
      body: data,
      headers: { "content-type": "application/json" },
    };
    api.post(url, options).then((res) => {
      if (!res.err) {
        console.log(!res.err, " erroro")
        // Si la respuesta no tiene error, procesamos la respuesta
        console.log("Respuesta recibida:", res);
        setcorrecto("Usuario guardado"); // Indicamos que el registro fue exitoso
        setdb(res); // Asumimos que esto actualiza tu base de datos o estado
        console.log("Datos guardados correctamente:", correcto);
      } else {
        const mensaje =
          typeof res.body === "string"
            ? res.body
            : res.body?.message || "Error desconocido";

        console.log("Error:", res);
        seterror(mensaje);
        //alert("Error al crear un Lote: " + mensaje);
      }
    });

    setTimeout(() => {
      seterror(null);
      setcorrecto(null);
    }, 4000);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="p-4  rounded bg-white">
        <div className="container  rounded">
          <h2 className="text-center fw-bold mb-3">Registrarse</h2>
          <p className="text-center text-muted mb-4">
            Complete el formulario para crear una cuenta.
          </p>
          {error && <Message msg={error} />}
          {correcto && <Message msg={correcto} bgColor="alert-success" />}

          <FormRegistro
            createData={createData}
            setdataToEdit={setdataToEdit}
            dataToEdit={dataToEdit}
          />
        </div>
      </div>
    </div>
  );
};
