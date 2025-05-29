import jwt from "jsonwebtoken";

function createVerificationToken(userId, code, businessId) {
  const payload = {
    userId,
    code,
    businessId,
    purpose: "verification", // Podemos especificar si es para verificación de email, reset de password, etc.
    createdAt: Date.now()
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.CODE_EXPIRATION });
}

export { createVerificationToken };
