const Sequelize = require("sequelize");
const config = require("../config/envs");

// const db = new Sequelize(config.NAME, config.USERNAME, config.PASSWORD, {
//   host: config.DB_HOST,
//   dialect: "postgres",
//   //logging: true,
// });

const db = new Sequelize("student-collab-db",
  null,
  null,
  {
    host: "localhost",
    dialect: "postgres",
    port: 5432,
  });

db.authenticate()
  .then(() => {
    console.log("Conexión a la base de datos", db.config.database);
  })
  .catch((err) => {
    console.error("No se pudo conectar a la base de datos", err);
  })

module.exports = db;