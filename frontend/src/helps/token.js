export function decodeJWT() {
  const tokenRaw = localStorage.getItem("token");
  if (!tokenRaw) throw new Error("No hay token");

  const parts = tokenRaw.split('.');
  if (parts.length !== 3) {
    throw new Error('El token no tiene el formato correcto');
  }

  const base64Decode = (str) => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    return atob(padded);
  };

  const payload = JSON.parse(base64Decode(parts[1]));
  return payload;
}