import db from "../config/database.js";

export class Business {
  static async findById({ id }) {
    try {
      const [businesses] = await db.query("SELECT * FROM business WHERE id = ?", [id]);

      if (businesses.length === 0) return null;
      return businesses[0];
    } catch (error) {
      throw new Error(`Error fetching business: ${error.message}`);
    }
  }

  static async create({ businessData }) {
    try {
      const { name, address, phone, email } = businessData;

      const [result] = await db.query(
        `INSERT INTO business 
         (name, address, phone, email) 
         VALUES (?, ?, ?, ?)`,
        [name, address, phone, email]
      );

      return { id: result.insertId, ...businessData };
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        if (error.message.includes("code")) {
          throw new Error("Code already exists");
        } else if (error.message.includes("barcode")) {
          throw new Error("Barcode already exists");
        }
      }
      throw new Error(`Error creating business: ${error.message}`);
    }
  }

  // eslint-disable-next-line no-unused-vars
  static async update({ id, businessData, businessId }) {
    // TODO
  }

  // eslint-disable-next-line no-unused-vars
  static async delete({ id, businessId }) {
    // TODO
  }
}
