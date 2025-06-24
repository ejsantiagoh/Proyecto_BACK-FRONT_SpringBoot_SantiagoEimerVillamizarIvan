import { useEffect, useState } from "react";
import { helpHttp } from "../../helps/helpHttp";
import { ProduccionCard } from "../../componentes/Cards/ProduccionCard";
import { VentasCard } from "../../componentes/Cards/VentasCard";

export const AdminReportes = () => {
  const [ventasPorTipo, setVentasPorTipo] = useState({});
  const [ventasPorCliente, setVentasPorCliente] = useState({});
  const [produccionData, setProduccionData] = useState({});
  const [inventarioData, setInventarioData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const urlVentasProducto = "http://localhost:8081/api/admin/reportes/ventas-producto";
  const urlVentasCliente = "http://localhost:8081/api/admin/reportes/ventas-cliente";
  const urlProduccion = "http://localhost:8081/api/admin/reportes/produccion";
  const urlInventario = "http://localhost:8081/api/admin/reportes/inventario";
  let api = helpHttp();

  useEffect(() => {
    const fetchVentasPorTipo = api.get(urlVentasProducto).then((res) => {
      if (!res.err) {
        setVentasPorTipo(res.ventasPorTipo || {});
        return { success: true };
      } else {
        setVentasPorTipo({});
        return { success: false, error: res };
      }
    });

    const fetchVentasPorCliente = api.get(urlVentasCliente).then((res) => {
      if (!res.err) {
        setVentasPorCliente(res.ventasPorCliente || {});
        return { success: true };
      } else {
        setVentasPorCliente({});
        return { success: false, error: res };
      }
    });

    const fetchProduccion = api.get(urlProduccion).then((res) => {
      if (!res.err) {
        setProduccionData(res || {});
        return { success: true };
      } else {
        setProduccionData({});
        return { success: false, error: res };
      }
    });

    const fetchInventario = api.get(urlInventario).then((res) => {
      if (!res.err) {
        setInventarioData(res || {});
        return { success: true };
      } else {
        setInventarioData({});
        return { success: false, error: res };
      }
    });

    Promise.all([
      fetchVentasPorTipo,
      fetchVentasPorCliente,
      fetchProduccion,
      fetchInventario,
    ]).then((results) => {
      const hasError = results.some((result) => !result.success);
      if (hasError) {
        setError(results.find((result) => !result.success)?.error || { message: "Error desconocido" });
      } else {
        setError(null);
      }
      setLoading(false);
    });
  }, [urlVentasProducto, urlVentasCliente, urlProduccion, urlInventario]);

  return (
    <>
      <div className="text-center mb-5 mt-3">
        <h1 className="fw-bold">Reportes de Ventas y Producción</h1>
        <p className="text-muted">
          Consulta las ventas por tipo de producto, cliente, reportes de producción e inventario
        </p>
      </div>

      <div className="container mt-3">
        {loading && <div className="alert alert-info">Cargando...</div>}
        {error && (
          <div className="alert alert-danger">
             {error.message || "Error al cargar los datos"}
          </div>
        )}
        {!loading && (
          <div className="row">
            <div className="col-md-4 mb-4">
              {Object.keys(ventasPorTipo).length > 0 ? (
                <VentasCard
                  title="Ventas por Tipo de Producto"
                  data={ventasPorTipo}
                  headerBgColor="bg-primary"
                  badgeBgColor="bg-success"
                />
              ) : (
                <div className="alert alert-warning">
                  No hay datos de ventas por producto disponibles
                </div>
              )}
            </div>

            <div className="col-md-4 mb-4">
              {Object.keys(ventasPorCliente).length > 0 ? (
                <VentasCard
                  title="Ventas por Cliente"
                  data={ventasPorCliente}
                  headerBgColor="bg-info"
                  badgeBgColor="bg-warning"
                />
              ) : (
                <div className="alert alert-warning">
                  No hay datos de ventas por cliente disponibles
                </div>
              )}
            </div>

            <div className="col-md-4 mb-4">
              {Object.keys(produccionData).length > 0 ? (
                <VentasCard
                  title="Reportes de Producción"
                  data={produccionData}
                  headerBgColor="bg-secondary"
                  badgeBgColor="bg-info"
                />
              ) : (
                <div className="alert alert-warning">
                  No hay datos de producción disponibles
                </div>
              )}
            </div>

            <div className="col-md-4 mb-4">
              {Object.keys(inventarioData).length > 0 ? (
                <VentasCard
                  title="Reporte de Inventario"
                  data={inventarioData}
                  headerBgColor="bg-dark"
                  badgeBgColor="bg-secondary"
                />
              ) : (
                <div className="alert alert-warning">
                  No hay datos de inventario disponibles
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
