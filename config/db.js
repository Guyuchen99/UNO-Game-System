require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

db.connect((error) => {
  if (error) {
    console.log("OH NO! Error connecting to MySQL:", error.message);
  } else {
    console.log("YAY! MySQL Connected...");
  }
});

module.exports = db;
