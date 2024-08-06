require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use("/auth", require("./routes/auth"));
app.use("/", require("./routes/pages"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
