import db from "../config/database.js";

export class SaleDetail {
  static async create({ saleData }) {
    try {
      const { saleId, articles } = saleData;
      // Insert into sale_detail table
      for (const article of articles) {
        const { article_id, quantity, unit_price, total_price } = article;
        await db.query(
          `INSERT INTO sale_detail (sale_id, article_id, quantity, unit_price, total_price) 
           VALUES (?, ?, ?, ?, ?)`,
          [saleId, article_id, quantity, unit_price, total_price]
        );
      }

      return { id: saleId, ...articles };
    } catch (error) {
      throw new Error(`Error creating sale: ${error.message}`);
    }
  }
}
