import db from "../config/database.js";

export class Article {
  static async getAll() {
    const [articles] = await db.query("SELECT * FROM article;");

    if (articles.length < 0) return [];
    return articles;
  }

  static async getById({ id }) {
    const [article] = await db.query("SELECT * FROM article WHERE id = ?;", [
      id,
    ]);

    if (article.length < 0) return {};
    return article[0];
  }

  static async create({ description, category, code, barcode, price, cost, stock }) {
    const [article] = await db.query(
      "INSERT INTO article (description, category, code, barcode, price, cost, stock) VALUES (?, ?, ?, ?, ?, ?, ?);",
      [description, category, code, barcode, price, cost, stock],
    );
    return article;
  }

  static async update({ id, input }) {
    return true;
  }

  static async delete({ id }) {
    return true;
  }
}
