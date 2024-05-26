const db = require("../index");
const S = require("sequelize");
const User = require("./User");

class Psycho extends S.Model {
  // generateHash(password, salt) {
  //   return bcrypt.hash(password, salt);
  // }

  // validatePassword(password) {
  //   return bcrypt
  //     .hash(password, this.salt)
  //     .then((hash) => hash === this.password);
  // }
}
//i can get de created date and modified date with the sequelize inner propierties
Psycho.init(
  {
    spec: {
      type: S.DataTypes.STRING,
      allowNull: false,
    },
    major: {
      type: S.DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "Psycho" }
);

// Psycho.findPsycho = (value) => {
//   return Psycho.findAll({
//     where: {
//       [S.Op.or]: [
//         { name: { [S.Op.iLike]: `%${value.toLowerCase()}%` } },
//         { lastname: { [S.Op.iLike]: `%${value.toLowerCase()}%` } }
//       ]
//     }
//   })
// }

// User.beforeCreate((usuario, options) => {
//   const salt = bcrypt.genSaltSync(8);
//   usuario.salt = salt;

//   return usuario
//     .generateHash(usuario.password, usuario.salt)
//     .then((hash) => (usuario.password = hash));
// });

// User.beforeUpdate((usuario, options) => {
//   return usuario
//     .generateHash(usuario.password, usuario.salt)
//     .then((hash) => (usuario.password = hash));
// });

module.exports = Psycho;