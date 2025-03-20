require('dotenv').config();
require("./src/database/connection.js");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const helmet = require("helmet");

const app = express();
const http = require("http").Server(app);
const PORT = process.env.PORT || 3001;
const routes = require("./src/routes");
const path = __dirname + "/public/";

app.use(express.static(path));
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

console.log("Environment is: " + process.env.NODE_ENV);

app.use("/", routes);

app.get("/*", (req, res) => {
  return res.sendFile(path + "index.html");
});

http.listen(PORT, () => console.log(`Running on ${PORT}`));
