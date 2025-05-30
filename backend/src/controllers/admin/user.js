import { User } from "../../models/user.js";
import crypto from "crypto";

export class UserController {
  static async getAll(req, res) {
    const businessId = req.session.business_id;

    const users = await User.findAll({ businessId });
    if (users.length === 0) {
      return res.status(200).json({ data: { users: [] }, message: "No hay usuarios registrados" });
    }

    res.status(200).json({ data: { users: users } });
  }

  static async getById(req, res) {
    const { id } = req.params;

    const user = await User.findById({ id });
    if (user) return res.status(200).json({ data: user });
    res.status(404).json({ message: "Usuario no encontrado" });
  }

  static async create(req, res) {
    const userData = req.body;
    const businessId = req.session.business_id;

    // Check if the user already exists
    const existingUser = await User.findByName({ username: userData.username });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }
    // Validate required fields
    if (!userData.username || !userData.password || !userData.full_name) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }
    // Set default role if not provided
    userData.role = userData.role || "cashier";

    // Hash the password with SHA-256
    const hashedPassword = crypto.createHash("sha256").update(userData.password).digest("hex");

    const data = {
      username: userData.username,
      password: hashedPassword,
      full_name: userData.full_name,
      role: userData.role
    };

    const newUser = await User.create({
      userData: data,
      businessId
    });

    if (!newUser) {
      return res.status(400).json({ message: "Error al crear el usuario" });
    }

    return res.status(201).json({
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          full_name: newUser.full_name,
          role: newUser.role
        }
      },
      message: "Usuario creado correctamente"
    });
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      const businessId = req.session.business_id;

      const updatedUser = await User.update({
        id,
        userData,

        businessId
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "Artículo no encontrado" });
      }

      return res.status(200).json({
        data: updatedUser,
        message: "Artículo actualizado correctamente"
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error al actualizar el artículo",
        error: error.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const businessId = req.session.business_id;

      const deleted = await User.delete({ id, businessId });

      if (!deleted) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      return res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      return res.status(500).json({
        message: "Error al eliminar el artículo",
        error: error.message
      });
    }
  }
}
