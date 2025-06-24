import React, { useState, useContext } from "react";
import FormLogin from "../componentes/FormLogin";
import { helpHttp } from "../helps/helpHttp";
import { Louder } from "../componentes/Louder";
import { AuthContext } from "../componentes/AuthContext";


const initialState = {
  email: "",
  password: "",
};

export const Login = () => {
  const { login } = useContext(AuthContext); // Obtener la función login del contexto
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [datos, setDatos] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({
      ...datos,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    datosLogin(datos);
  };

  let url = "http://localhost:8081/api/auth/login";
  const api = helpHttp();

const datosLogin = (data) => {
  let options = {
    body: data,
    headers: { "content-type": "application/json" },
  };
  setLoading(true);
  api.post(url, options).then((res) => {
    console.log("Respuesta cruda del servidor:", res);
    if (!res.err) {
      const token = typeof res === 'string' ? res : res.token;
      console.log("Token extraído:", token);
      login(token);
    } else {
      console.log("Error en el login", res);
      setMsg(res);
      setTimeout(() => {
        setMsg(null);
      }, 3000);
    }
    setLoading(false);
  });
};

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="p-4 rounded bg-white">
        {loading ? (
          <Louder />
        ) : (
          <FormLogin
            msg={msg}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};