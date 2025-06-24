export const ProduccionCard = ({ title, data, headerBgColor, badgeBgColor }) => {
    
  return (
    <div className="card shadow-sm">
      <div className={`card-header ${headerBgColor} text-white`}>{title}</div>
      <div className="card-body">
        {Object.entries(data).length > 0 ? (
          Object.entries(data).map(([key, value]) => (
            <div key={key} className="d-flex justify-content-between mb-2">
              <span>{key.replaceAll("_", " ")}</span>
              
              <span className={`badge ${badgeBgColor}`}>{value}</span>
            </div>
          ))
        ) : (
          <p>No hay datos disponibles</p>
        )}
      </div>
    </div>
  );
  
};
