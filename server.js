// Configuración del server
const express = require("express");
const app = express();
const morgan = require("morgan");
const routes = require("./src/routes");
const db = require("./src/db/index");
const cors = require("cors");
const envs = require("./src/config/envs");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // para comunicar entre puertos
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("tiny"));
//app.use(express.static(__dirname + "/public"));

app.use("/api", routes);

// app.use("/*", function (req, res) {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

db.sync({ force: false })
  .then(() => {
    app.listen(8000, () => {
      console.log("Escuchando en el puerto 8000");
    });
  });

module.exports = app;