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

  static async getByCode(req, res) {
    try {
      const { code } = req.params;
      const businessId = req.session.business_id;

      const article = await Article.findByCode({ code, businessId });

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

  static async getByBarcode(req, res) {
    try {
      const { barcode } = req.params;
      const businessId = req.session.business_id;

      const article = await Article.findByBarcode({ barcode, businessId });

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

  static async create(req, res) {
    try {
      const articleData = req.body;
      const businessId = req.session.business_id;

      const newArticle = await Article.create({
        articleData,
        businessId
      });

      return res.status(201).json({
        success: true,
        data: newArticle,
        message: "Artículo creado correctamente"
      });
    } catch {
      return res.status(400).json({
        success: false,
        message: "Error al crear el artículo"
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const businessId = req.session.business_id;

      const updatedArticle = await Article.update({
        id,
        articleData: req.body,
        businessId
      });

      if (!updatedArticle) {
        return res.status(404).json({
          success: false,
          message: "El artículo no existe"
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedArticle,
        message: "Artículo actualizado correctamente"
      });
    } catch {
      return res.status(400).json({
        success: false,
        message: "Error al actializar el artículo"
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const businessId = req.session.business_id;

      const deleted = await Article.delete({ id, businessId });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "El artículo no existe"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Artículo eliminado correctamente"
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Error al eliminar el artículo"
      });
    }
  }
}
