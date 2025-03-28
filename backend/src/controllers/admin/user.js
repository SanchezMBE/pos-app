import { User } from "../../models/user.js";

export class UserController {
  static async getAll(req, res) {
    const users = await User.getAll();
    res.status(200).json({ data: users });
  }

  static async getById(req, res) {
    const { id } = req.params;

    const user = await User.getById({ id });
    if (user) return res.status(200).json({ data: user });
    res.status(404).json({ message: "Artículo no encontrado" });
  }

  static async create(req, res) {
    const {  } =
      req.body;
    const newUser = await User.create({
      description,
      category,
      code,
      barcode,
      price,
      cost,
      stock,
    });

    return res.status(201).json({ data: newUser });
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { description, category, code, barcode, price, cost, stock } =
        req.body;

      const updatedUser = await User.update({
        id,
        description,
        category,
        code,
        barcode,
        price,
        cost,
        stock,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "Artículo no encontrado" });
      }

      return res
        .status(200)
        .json({
          data: updatedUser,
          message: "Artículo actualizado correctamente",
        });
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "Error al actualizar el artículo",
          error: error.message,
        });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const deleted = await User.delete({ id });

      if (!deleted) {
        return res.status(404).json({ message: "Artículo no encontrado" });
      }

      return res
        .status(200)
        .json({ message: "Artículo eliminado correctamente" });
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "Error al eliminar el artículo",
          error: error.message,
        });
    }
  }
}
