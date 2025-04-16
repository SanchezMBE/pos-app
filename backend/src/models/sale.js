import db from "../config/database.js";

export class Sale {
  static async findAll({ businessId }) {
    try {
      const [sales] = await db.query(
        `SELECT s.sale_date, u.full_name, u.username, u.role, s.total
         FROM sale s
         JOIN user u ON s.user_id = u.id
         WHERE s.business_id = ?
         ORDER BY s.id DESC`,
        [businessId]
      );

      return sales;
    } catch (error) {
      throw new Error(`Error fetching sales: ${error.message}`);
    }
  }

  static async create({ saleData, businessId, userId }) {
    try {
      const { cash_audit_id, total } = saleData;

      const [saleResult] = await db.query(
        `INSERT INTO sale (business_id, user_id, cash_audit_id, total) 
         VALUES (?, ?, ?, ?)`,
        [businessId, userId, cash_audit_id, total]
      );

      return { id: saleResult.insertId, ...saleData };
    } catch (error) {
      throw new Error(`Error creating sale: ${error.message}`);
    }
  }
}
