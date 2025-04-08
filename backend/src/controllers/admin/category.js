import { Category } from "../../models/category.js";

export class ArticleController {
  static async getAll(req, res) {
    try {
      const { name } = req.query;
      const businessId = req.user.business_id;

      const categories = await Category.findAll({ name, businessId });
      return res.status(200).json({
        success: true,
        data: categories
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

      const category = await Category.findById({ id, businessId });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Article not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}
