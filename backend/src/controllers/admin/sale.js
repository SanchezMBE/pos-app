import { Sale } from "../../models/sale.js";
import { SaleDetail } from "../../models/sale_detail.js";
import { Article } from "../../models/article.js";

export class SaleController {
  static async getAll(req, res) {
    try {
      const businessId = req.session.business_id;
      const sales = await Sale.findAll({ businessId });

      return res.status(200).json({
        success: true,
        data: sales,
        message: "Ventas obtenidas correctamente"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async create(req, res) {
    try {
      const saleData = req.body;
      const businessId = req.session.business_id;
      const userId = req.session.user_id;
      console.log(req.session);

      const newSale = await Sale.create({
        saleData,
        businessId,
        userId
      });

      await SaleDetail.create({
        saleData: { saleId: newSale.id, articles: saleData.articles }
      });

      // Update stock for each article in the sale
      for (const article of saleData.articles) {
        const { article_id, quantity } = article;
        await Article.updateStock({ articleId: article_id, quantity });
      }

      return res.status(201).json({
        success: true,
        data: { ...newSale },
        message: "Venta creada correctamente"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}
