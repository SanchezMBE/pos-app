import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json({ error: "Acceso denegado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.session = decoded;
    next();
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(403).json({ error: "Token inválido" });
  }
};
