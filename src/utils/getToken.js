const getUserTokenFromHeaders = (headers) => {
  // Obtener el valor del encabezado 'cookie'
  const cookies = headers.cookie;

  // Dividir las cookies en pares clave-valor
  if (cookies) {
    const cookiePairs = cookies.split('; ');

    // Buscar el par clave-valor que contiene el token de usuario
    for (const pair of cookiePairs) {
      const [key, value] = pair.split('=');
      if (key === 'userToken') {
        // Retorna el valor del token de usuario
        return value;
      }
    }
  }

  // Si no se encuentra el token de usuario en las cookies, retorna null o realiza alguna otra acción apropiada
  return null;
};

module.exports = getUserTokenFromHeaders;