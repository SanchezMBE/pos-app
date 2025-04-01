import crypto from "crypto";
import jwt from "jsonwebtoken";
import db from "../config/database.js";

export class AuthController {
  static async signup(req, res) {
    const { username, password, full_name, business_id, role } = req.body;
  
    try {
      // Verificar si el usuario ya existe
      const [existingUsers] = await db.query("SELECT * FROM user WHERE username = ?", [username]);
      if (existingUsers.length > 0) {
        return res.status(400).json({ error: "El nombre de usuario ya está en uso" });
      }
  
      // Hashear la contraseña con SHA-256
      const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
  
      // Insertar nuevo usuario
      const [result] = await db.query(
        "INSERT INTO user (username, password, full_name, business_id, role) VALUES (?, ?, ?, ?, ?)",
        [username, hashedPassword, full_name, business_id, role]
      );
    
      // Responder con el usuario creado
      res.status(201).json({ id: result.insertId, username, full_name, business_id, role });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async login(req, res) {
    const { username, password } = req.body;

    try {
      const [users] = await db.query("SELECT * FROM user WHERE username = ?", [username]);

      if (users.length === 0) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const user = users[0];
      const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

      if (user.password !== hashedPassword) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      // Creación del token JWT
      const token = jwt.sign(
        { id: user.id, business_id: user.business_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}