const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  queueLimit: 0,
  port: process.env.DB_PORT || 3306,
  connectTimeout: 10000,
});

pool.getConnection()
  .then(connection => {
    console.log("Connected to MySQL database");
    connection.release();
  })
  .catch(err => console.error("MySQL connection error:", err));

const closePool = async () => {
  try {
    await pool.end();
    console.log("MySQL pool closed");
    process.exit(0);
  } catch (err) {
    console.error("Error closing MySQL pool:", err);
    process.exit(1);
  }
};

process.on("SIGINT", closePool);
process.on("SIGTERM", closePool);

module.exports = pool;
