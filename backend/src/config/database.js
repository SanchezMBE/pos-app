import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  port: process.env.DBPORT,
  password: process.env.DBPASS,
  database: process.env.DBNAME
});

(async () => {
  try {
    const connection = await pool.getConnection(); // Try to get a connection
    console.log(`Connected to the database on port ${process.env.DBPORT}`);
    connection.release(); // Release the connection after testing
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();

export default pool;

// create table article (id int not null auto_increment, description varchar(255) not null, category varchar(255) not null, code varchar(255) unique, barcode varchar(13) unique, price float not null, cost float, stock float, primary key(id));
