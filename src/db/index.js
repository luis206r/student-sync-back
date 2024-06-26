const Sequelize = require("sequelize");
const config = require("../config/envs");

// const db = new Sequelize(config.NAME, config.USERNAME, config.PASSWORD, {
//   host: config.DB_HOST,
//   dialect: "postgres",
//   //logging: true,
// });


const db = new Sequelize("student_collab_db",
  "student_collab_db_user",
  "Bvv64qjpivdjhhGmOrPyZG9EKz1SZ0nZ",
  {
    host: "dpg-cp3h4tnsc6pc73fopjug-a",
    dialect: "postgres",
    port: 5432,
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
