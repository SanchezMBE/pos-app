import db from "../config/database.js";

export class User {
  static async getAll() {
    const [users] = await db.query("SELECT * FROM user;");

    if (users.length < 0) return [];
    return users;
  }

  static async getById({ id }) {
    const [user] = await db.query("SELECT * FROM user WHERE id = ?;", [
      id,
    ]);

    if (user.length < 0) return {};
    return user[0];
  }

  static async create({  }) {
    const [user] = await db.query(
      "INSERT INTO user (description, category, code, barcode, price, cost, stock) VALUES (?, ?, ?, ?, ?, ?, ?);",
      [description, category, code, barcode, price, cost, stock],
    );
    return user;
  }

  static async update({ id, input }) {
    return true;
  }

  static async delete({ id }) {
    return true;
  }
}
