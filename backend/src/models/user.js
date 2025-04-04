import db from "../config/database.js";

export class User {
  static async findAll({ businessId }) {
    try {
      const [result] = await db.query(
        `SELECT a.*, c.name as category_name 
         FROM user a
         JOIN category c ON a.category_id = c.id
         WHERE a.business_id = ?
         ORDER BY a.id DESC`,
        [businessId]
      );
      return result;
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  static async findById({ id }) {
    try {
      const [result] = await db.query("SELECT * FROM user WHERE id = ?", [id]);

      if (result.length === 0) return null;
      return result[0];
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  static async findByName({ username }) {
    try {
      const [result] = await db.query("SELECT * FROM user WHERE username = ?", [username]);

      if (result.length === 0) return null;

      return result[0];
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  static async create({ userData, businessId }) {
    try {
      const { username, password, full_name, role } = userData;

      const [result] = await db.query(
        `INSERT INTO user 
         (business_id, username, password, full_name, role) 
         VALUES (?, ?, ?, ?, ?)`,
        [businessId, username, password, full_name, role]
      );

      return { id: result.insertId, ...userData };
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        if (error.message.includes("code")) {
          throw new Error("Code already exists");
        } else if (error.message.includes("barcode")) {
          throw new Error("Barcode already exists");
        }
      }
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  static async update({ id, userData, businessId }) {
    try {
      const { username, password, full_name } = userData;

      const [result] = await db.query(
        `UPDATE user 
         SET username = ?, password = ?, full_name = ?
         WHERE id = ? AND business_id = ?`,
        [username, password, full_name, id, businessId]
      );

      if (result.affectedRows === 0) return null;
      return { id, ...userData };
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        if (error.message.includes("code")) {
          throw new Error("Code already exists");
        } else if (error.message.includes("barcode")) {
          throw new Error("Barcode already exists");
        }
      }
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  static async delete({ id, businessId }) {
    try {
      const [result] = await db.query("DELETE FROM user WHERE id = ? AND business_id = ?", [id, businessId]);

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}
