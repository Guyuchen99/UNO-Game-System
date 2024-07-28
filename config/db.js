require("dotenv").config();
const fs = require("fs");
const mysql = require("mysql2");
const { type } = require("os");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  // database: process.env.DATABASE,
});


db.connect((error) => {
  if (error) {
    console.error("OH NO! Error connecting to MySQL:", error.message);
  } else {
    // check if database exists
    if (db.config.database === undefined) {
      db.query(`CREATE DATABASE ${process.env.DATABASE}`, (error, results, fields) => {
        if (error) {
          if (error.message.includes("database exists")) {
            console.log("Database already exists. Skipping creation.");
            db.query(`USE ${process.env.DATABASE}`, (error, results, fields) => {
              if (error) {
                console.error("Failed switching db: ", error.message);
              } else {
                console.log("Switch successful.");
              }
            });
          } else {
            console.error("Failed creating db: ", error.message);
          }
        } else {
          console.log("Create successful.");
          db.query(`USE ${process.env.DATABASE}`, (error, results, fields) => {
            if (error) {
              console.error("Failed switching db: ", error.message);
            } else {
              console.log("Switch successful.");
              // initialize DB: create tables, insert dummy data
              initializeDB();
              console.log("Initialization successful.");
            }
          });
        }
      });
    }
  }
});

function initializeDB() {
  let sql = fs.readFileSync("uno.sql").toString().split(";");
  for (let i = 0; i < sql.length; i++) {
    if (sql[i].trim() !== "") {
      db.query(sql[i], (error, results, fields) => {
        if (error) {
          console.error("Failed initializing db: ", error.message);
        }
      });
    }
  }
}

function fileLog(content) {
  content = content + '\n';
  fs.appendFileSync("./log.txt", content, err => {
    if (err) {
      console.log(err);
    }
  })
}

module.exports = db;
