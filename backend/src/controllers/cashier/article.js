import { Article } from "../../models/article.js";

export class ArticleController {
  static async getAll(req, res) {
    try {
      const { description } = req.query;
      const businessId = req.session.business_id;

      const articles = await Article.findAll({ description, businessId });
      return res.status(200).json({
        success: true,
        data: articles
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Error al obtener los artículos"
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const businessId = req.session.business_id;

      const article = await Article.findById({ id, businessId });

      if (!article) {
        return res.status(404).json({
          success: false,
          message: "Artículo no encontrado"
        });
      }

      return res.status(200).json({
        success: true,
        data: article
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Error al obtener el artículo"
      });
    }
  }
}
