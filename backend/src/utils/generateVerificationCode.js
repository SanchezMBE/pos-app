import crypto from "crypto";

function generateVerificationCode(length = 6) {
  // Generamos un código numérico aleatorio
  return crypto.randomInt(100000, 999999).toString().padStart(length, "0");
}

export { generateVerificationCode };
