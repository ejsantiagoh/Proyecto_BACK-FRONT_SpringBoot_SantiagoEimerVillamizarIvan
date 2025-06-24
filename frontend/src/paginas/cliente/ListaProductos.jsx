// ListaProductos.jsx
import React, { useContext, useEffect, useState } from 'react';
import '../../../public/style.css';
import { helpHttp } from '../../helps/helpHttp';
import { Productos } from '../../componentes/Productos';
import { AuthContext } from '../../componentes/AuthContext';

export const ListaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const api = helpHttp();
  const productosUrl = 'http://localhost:8081/api/productos';
  const idCliente = user?.clientId;

  // Mapeo de nombres de productos a imágenes
  const imagenesMapeo = {
    Atun_en_aceite: 'Atun_en_aceite.jpg',
    Atun_en_agua: 'Atun_en_agua.jpg',
    Atun_en_salsa: 'Atun_en_salsa.jpg',
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosRes = await api.get(productosUrl);

        if (!productosRes.err) {
          const productosConImagenes = productosRes.map((producto) => ({
            ...producto,
            imagen: `/public/Imagenes/${imagenesMapeo[producto.nombre] || "default.jpg"}`
          }));
          setProductos(productosConImagenes);
        } else {
          setProductos([]);
          setError("Error al obtener productos.");
        }
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError("Hubo un problema al obtener los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [productosUrl]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Nuestros Productos</h2>
      {loading && <p className="text-center">Cargando productos...</p>}
      {error && <p className="text-danger text-center">Error al cargar los productos: {error}</p>}
      {!loading && !error && productos.length === 0 && (
        <p className="text-center">No hay productos disponibles.</p>
      )}
      {!loading && !error && productos.length > 0 && (
        <Productos productos={productos} idCliente={idCliente} />
      )}
    </div>
  );
};
