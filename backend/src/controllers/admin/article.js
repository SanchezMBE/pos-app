import { Article } from "../../models/article.js";

export class ArticleController {
  static async getAll(req, res) {
    try {
      const { description } = req.query;
      const businessId = req.user.business_id;

      const articles = await Article.findAll({ description, businessId });
      return res.status(200).json({
        success: true,
        data: articles
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const businessId = req.user.business_id;

      const article = await Article.findById({ id, businessId });

      if (!article) {
        return res.status(404).json({
          success: false,
          message: "Article not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: article
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getByCode(req, res) {
    try {
      const { code } = req.params;
      const businessId = req.user.business_id;

      const article = await Article.findByCode({ code, businessId });

      if (!article) {
        return res.status(404).json({
          success: false,
          message: "Article not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: article
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getByBarcode(req, res) {
    try {
      const { barcode } = req.params;
      const businessId = req.user.business_id;

      const article = await Article.findByBarcode({ barcode, businessId });

      if (!article) {
        return res.status(404).json({
          success: false,
          message: "Article not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: article
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async create(req, res) {
    try {
      const articleData = req.body;
      const businessId = req.user.business_id;

      const newArticle = await Article.create({
        articleData,
        businessId
      });

      return res.status(201).json({
        success: true,
        data: newArticle,
        message: "Article created successfully"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const businessId = req.user.business_id;

      const updatedArticle = await Article.update({
        id,
        articleData: req.body,
        businessId
      });

      if (!updatedArticle) {
        return res.status(404).json({
          success: false,
          message: "Article not found or does not belong to your business"
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedArticle,
        message: "Article updated successfully"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const businessId = req.user.business_id;

      const deleted = await Article.delete(id, businessId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Article not found or does not belong to your business"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Article deleted successfully"
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}
