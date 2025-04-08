/* eslint-disable no-unused-vars */
import db from "../config/database.js";

export class Category {
  static async findAll({ name, businessId }) {
    try {
      let categories = [];
      if (name) {
        const nameParam = `%${name}%`;
        [categories] = await db.query(
          `SELECT *
           FROM category
           WHERE name LIKE ?
           ORDER BY id DESC`,
          [nameParam]
        );
      } else {
        [categories] = await db.query(
          `SELECT *
           FROM category
           ORDER BY id DESC`,
          []
        );
      }
      return categories;
    } catch (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }
  }

  static async findById({ id, businessId }) {
    try {
      const [categories] = await db.query(
        `SELECT *
         FROM category
         WHERE id = ?
         ORDER BY id DESC`,
        [id]
      );

      if (categories.length === 0) return null;
      return categories[0];
    } catch (error) {
      throw new Error(`Error fetching category: ${error.message}`);
    }
  }
}
