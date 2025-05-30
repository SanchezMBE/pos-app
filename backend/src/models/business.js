import db from "../config/database.js";

export class Business {
  static async findById({ id }) {
    try {
      const [businesses] = await db.query("SELECT * FROM business WHERE id = ?", [id]);

      if (businesses.length === 0) return null;
      return businesses[0];
    } catch (error) {
      throw new Error(`Error al obtener el negocio: ${error.message}`);
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
      throw new Error(`Error al crear el negocio: ${error.message}`);
    }
  }

  static async update({ businessId, businessData }) {
    try {
      const { name, address, phone, email } = businessData;

      const [result] = await db.query(
        `UPDATE business 
         SET name = ?, address = ?, phone = ?, email = ? 
         WHERE id = ?`,
        [name, address, phone, email, businessId]
      );

      if (result.affectedRows === 0) {
        throw new Error("No se encontró el negocio para actualizar");
      }

      return { id: businessId, ...businessData };
    } catch (error) {
      throw new Error(`Error actualizar negocio: ${error.message}`);
    }
  }

  // eslint-disable-next-line no-unused-vars
  static async delete({ id, businessId }) {
    // TODO
  }
}
