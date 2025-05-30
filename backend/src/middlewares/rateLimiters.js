import { rateLimit } from "express-rate-limit";

// Aplica a /api/auth/login y /api/auth/signup
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 50, // máximo de 50 solicitudes por IP
  message: {
    status: 429,
    error: "Demasiadas peticiones. Intenta de nuevo más tarde."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// /api/auth/me: solo se llama al cambiar de página o recargar
export const authMeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    error: "Demasiadas peticiones. Intenta de nuevo más tarde."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Proteger acciones sensibles
export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    error: "Demasiadas peticiones. Intenta de nuevo más tarde."
  },
  standardHeaders: true,
  legacyHeaders: false
});
