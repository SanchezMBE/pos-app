import { Article } from "../../models/Article.js";

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
    const { description, category, code, barcode, price, cost, stock } = req.body;
    const newArticle = await Article.create({ description, category, code, barcode, price, cost, stock });

    return res.status(201).json({ data: newArticle });
  }

  static update = (req, res) => {
    res.status(200).json({ message: "articulo actualizado" });
  };

  static delete = (req, res) => {
    res.status(200).json({ message: "articulo eliminado" });
  };
}
