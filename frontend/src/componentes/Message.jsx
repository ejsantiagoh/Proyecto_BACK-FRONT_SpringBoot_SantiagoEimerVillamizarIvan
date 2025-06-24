export const Message = ({ msg, bgColor = "alert-danger" }) => {
  console.log("mensaje 2 ", msg);

  const renderMsg =
    typeof msg === "string"
      ? msg
      : msg?.message || JSON.stringify(msg) || "Error desconocido";

  return (
    <div className={`alert ${bgColor} text-center fw-semibold`} role="alert">
      {renderMsg}
    </div>
  );
};
