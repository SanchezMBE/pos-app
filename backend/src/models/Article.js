import db from "../config/database.js";

export class Article {
  static async findAll({ description, businessId }) {
    try {
      let articles = [];
      if (description) {
        const descriptionParam = `%${description}%`;
        [articles] = await db.query(
          `SELECT a.*, c.name as category_name 
           FROM article a
           JOIN category c ON a.category_id = c.id
           WHERE a.description LIKE ?
           AND a.business_id = ?
           ORDER BY a.id DESC`,
          [descriptionParam, businessId]
        );
      } else {
        [articles] = await db.query(
          `SELECT a.*, c.name as category_name 
           FROM article a
           JOIN category c ON a.category_id = c.id
           WHERE a.business_id = ?
           ORDER BY a.id DESC`,
          [businessId]
        );
      }
      return articles;
    } catch (error) {
      throw new Error(`Error fetching articles: ${error.message}`);
    }
  }

  static async findById({ id, businessId }) {
    try {
      const [articles] = await db.query(
        `SELECT a.*, c.name as category_name 
         FROM article a
         JOIN category c ON a.category_id = c.id
         WHERE a.id = ? AND a.business_id = ?`,
        [id, businessId]
      );

      if (articles.length === 0) return null;
      return articles[0];
    } catch (error) {
      throw new Error(`Error fetching article: ${error.message}`);
    }
  }

  static async findByCode({ code, businessId }) {
    try {
      const [articles] = await db.query(
        `SELECT a.*, c.name as category_name 
         FROM article a
         JOIN category c ON a.category_id = c.id
         WHERE a.code = ? AND a.business_id = ?`,
        [code, businessId]
      );

      if (articles.length === 0) return null;
      return articles[0];
    } catch (error) {
      throw new Error(`Error fetching article: ${error.message}`);
    }
  }

  static async findByBarcode({ barcode, businessId }) {
    try {
      const [articles] = await db.query(
        `SELECT a.*, c.name as category_name 
         FROM article a
         JOIN category c ON a.category_id = c.id
         WHERE a.barcode = ? AND a.business_id = ?`,
        [barcode, businessId]
      );

      if (articles.length === 0) return null;
      return articles[0];
    } catch (error) {
      throw new Error(`Error fetching article: ${error.message}`);
    }
  }

  static async create({ articleData, businessId }) {
    try {
      const { category_id, description, code, barcode, price, cost, stock } = articleData;

      const [result] = await db.query(
        `INSERT INTO article 
         (business_id, category_id, description, code, barcode, price, cost, stock) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [businessId, category_id, description, code, barcode, price, cost, stock]
      );

      return { id: result.insertId, ...articleData };
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        if (error.message.includes("code")) {
          throw new Error("Code already exists");
        } else if (error.message.includes("barcode")) {
          throw new Error("Barcode already exists");
        }
      }
      throw new Error(`Error creating article: ${error.message}`);
    }
  }

  static async update({ id, articleData, businessId }) {
    try {
      const { category_id, description, code, barcode, price, cost, stock } = articleData;

      const [result] = await db.query(
        `UPDATE article 
         SET category_id = ?, description = ?, code = ?, barcode = ?, 
             price = ?, cost = ?, stock = ?
         WHERE id = ? AND business_id = ?`,
        [category_id, description, code, barcode, price, cost, stock, id, businessId]
      );

      if (result.affectedRows === 0) return null;
      return { id, ...articleData };
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        if (error.message.includes("code")) {
          throw new Error("Code already exists");
        } else if (error.message.includes("barcode")) {
          throw new Error("Barcode already exists");
        }
      }
      throw new Error(`Error updating article: ${error.message}`);
    }
  }

  static async delete({ id, businessId }) {
    try {
      const [result] = await db.query("DELETE FROM article WHERE id = ? AND business_id = ?", [id, businessId]);

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting article: ${error.message}`);
    }
  }
}
