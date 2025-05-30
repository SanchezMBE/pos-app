import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

(async () => {
  try {
    const connection = await pool.getConnection(); // Try to get a connection
    console.log(`Connected to the database on port ${process.env.DB_PORT}`);
    connection.release(); // Release the connection after testing
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();

export default pool;

// create table article (id int not null auto_increment, description varchar(255) not null, category varchar(255) not null, code varchar(255) unique, barcode varchar(13) unique, price float not null, cost float, stock float, primary key(id));

// import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from "../../config.js";

// const pool = mysql.createPool({
//   host: DB_HOST,
//   user: DB_USER,
//   port: DB_PORT,
//   password: DB_PASS,
//   database: DB_NAME
// });
