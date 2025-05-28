import jwt from "jsonwebtoken";

function verifyCode(token, code) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificamos que el código coincide
    if (decoded.code !== code) {
      return false;
    }

    return decoded;
  } catch (error) {
    // El token no es válido o ha expirado
    console.error("Error al verificar el token:", error.message);
    return false;
  }
}

export { verifyCode };
