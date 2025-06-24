// src/pages/Error404.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export const Error404 = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center bg-light">
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <p className="fs-3">
        <span className="text-danger">Oops!</span> Página no encontrada.
      </p>
      <p className="lead">La ruta que intentaste no existe o fue eliminada.</p>
      {/* <Link to="/" className="btn btn-dark mt-3">
        Volver al inicio
      </Link> */}
    </div>
  );
};
