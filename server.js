const cookieParser = require("cookie-parser");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
