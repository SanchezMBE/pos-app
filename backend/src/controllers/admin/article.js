import { Article } from "../../models/article.js";

export class ArticleController {
  static async getAll(req, res) {
    const articles = await Article.getAll();
    res.status(200).json({ data: articles });
  }

  static async getById(req, res) {
    const { id } = req.params;

    const article = await Article.getById({ id });
    if (article) return res.status(200).json({ data: article });
    res.status(404).json({ message: "Artículo no encontrado" });
  }

  static async create(req, res) {
    const { description, category, code, barcode, price, cost, stock } =
      req.body;
    const newArticle = await Article.create({
      description,
      category,
      code,
      barcode,
      price,
      cost,
      stock,
    });

    return res.status(201).json({ data: newArticle });
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { description, category, code, barcode, price, cost, stock } =
        req.body;

      const updatedArticle = await Article.update({
        id,
        description,
        category,
        code,
        barcode,
        price,
        cost,
        stock,
      });

      if (!updatedArticle) {
        return res.status(404).json({ message: "Artículo no encontrado" });
      }

      return res
        .status(200)
        .json({
          data: updatedArticle,
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

      const deleted = await Article.delete({ id });

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
