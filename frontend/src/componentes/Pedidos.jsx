import { CardPedidosAdmin } from "./Cards/CardPedidosAdmin";


export const Pedidos = ({ datapedidos }) => {

  return (
    <>
            <div className="col-md-6">
            <label htmlFor="buscarCliente" className="form-label fw-semibold">
              Buscar por nombre o identificación
            </label>
            <input
              type="text"
              className="form-control"
              id="buscarCliente"
              placeholder="Ej: Distribuidora Norte o 900123456"
            />
          </div>
          {/* Select de clientes */}
          <div className="col-md-4">
            <label htmlFor="selectCliente" className="form-label fw-semibold">
              Filtrar por cliente
            </label>
            <select className="form-select" id="selectCliente">
              <option value="">Todos</option>
              <option value={1}>Distribuidora Norte</option>
              <option value={2}>Supermercado Sur</option>
            </select>
          </div>
          <h4 className="text-black fw-bold mt-3">Lista de Pedidos</h4>
      {datapedidos ? 

        datapedidos.map( el => <CardPedidosAdmin data={el} key={el.id} />)
        
      : (
            <p className="mt-5 fw-semibold">No hay pedidos</p>
      )}

    </>
  );
};
