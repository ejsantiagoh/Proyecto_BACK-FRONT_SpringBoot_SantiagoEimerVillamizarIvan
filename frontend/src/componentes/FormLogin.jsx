import React from 'react'
import { Link } from 'react-router-dom'
import { Message } from './Message'

export default function FormLogin({handleChange, handleSubmit, msg}) {




  return (
    <>
<div className="container  rounded">
  <h2 className="text-center fw-bold mb-3">Ingresar</h2>
  <p className="text-center text-muted mb-4">
    Ingrese su email y contraseña para ingresar.
  </p>
  <form>
    <div className="mb-3">
      <label htmlFor="username" className="form-label fw-semibold">
        Nombre de usuario
      </label>
      <input
        type="username"
        className="form-control"
        id="username"
        placeholder="nombre de usuario"
        onChange={handleChange}
        name="username"
        required
      />
    </div>
    <div className="mb-4">
      <label htmlFor="password" className="form-label fw-semibold">
        Contraseña
      </label>
      <input
        type="password"
        className="form-control"
        id="password"
        placeholder="********"
        onChange={handleChange}
        name="password"
        required
      />
    </div>
      { msg && <Message msg="Error al ingresar los datos del usuario y contraseña"/>}
    <div className="d-grid">
      <button type="submit" className="btn btn-dark fw-semibold" onClick={handleSubmit}>
        Ingresar
      </button>
    </div>
    <div className="d-grid mt-3">
      <Link to="/registro" className="btn btn-outline-secondary fw-semibold" >
      Registro
      </Link>
    </div>
  </form>
</div>


    </>
  )
}
