const Sequelize = require("sequelize");
require('dotenv').config();
// const db = new Sequelize(config.NAME, config.USERNAME, config.PASSWORD, {
//   host: config.DB_HOST,
//   dialect: "postgres",
//   //logging: true,
// });


const db = new Sequelize(process.env.DB_NAME,
  process.env.DB_USER || null,
  process.env.DB_PASSWORD || null,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: 5432,
    loggin: true
  });

// const db = new Sequelize("student-collab-db",
//   null, null,
//   {
//     //host: "postgres",
//     dialect: "postgres",
//     port: 5432,
//     loggin: true
//   });

db.authenticate()
  .then(() => {
    console.log("Conexión a la base de datos", db.config.database);
  })
  .catch((err) => {
    console.error("No se pudo conectar a la base de datos", err);
  })

module.exports = db;
