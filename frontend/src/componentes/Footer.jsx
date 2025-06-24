
import React from "react";
const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          {/* Company Information */}
          {/* <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Atunes del Pacífico S.A.</h5>
            <p className="text-muted">
              Líderes en la producción, almacenamiento, distribución y venta de productos de atún de alta calidad. Comprometidos con la sostenibilidad y la excelencia.
            </p>
          </div> */}

          {/* Contact Information */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Contáctanos</h5>
            <ul className="list-unstyled">
              <li><i className="bi bi-geo-alt-fill me-2"></i> Av. del Mar 123 Colombia</li>
              <li><i className="bi bi-telephone-fill me-2"></i> +593 4 123 4567</li>
              <li><i className="bi bi-envelope-fill me-2"></i> info@atunesdelpacifico.com</li>
              <li><i className="bi bi-globe me-2"></i> www.atunesdelpacifico.com</li>
            </ul>
          </div>
        </div>
        <hr className="bg-secondary" />
        <div className="text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} Atunes del Pacífico S.A. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;