require("dotenv").config();
const fs = require("fs");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
});

db.connect((error) => {
  if (error) {
    console.error("OH NO! Error connecting to MySQL:", error.message);
    return;
  }

  if (db.config.database === undefined) {
    db.query(`CREATE DATABASE ${process.env.DATABASE}`, (error, results) => {
      if (error && !error.message.includes("database exists")) {
        console.error("Failed creating db: ", error.message);
        return;
      }

      if (!error) {
        console.log("Create successful.");
      } else {
        console.log("Database already exists. Skipping creation.");
      }

      db.query(`USE ${process.env.DATABASE}`, (error) => {
        if (error) {
          console.error("Failed switching db: ", error.message);
          return;
        }

        console.log("Switch successful.");
        initializeDB();
        console.log("Initialization successful.");
      });
    });
  }
});

function initializeDB() {
  const sql = fs.readFileSync("uno.sql").toString().split(";").filter(stmt => stmt.trim() !== "");
  sql.forEach(stmt => {
    db.query(stmt, (error) => {
      if (error) {
        console.error("Failed initializing db: ", error.message);
      }
    });
  });
}

function fileLog(content) {
  fs.appendFileSync("./log.txt", `${content}\n`, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = db;
