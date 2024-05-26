const db = require("../index");
const S = require("sequelize");
const Content = require("./Content");

class Event extends S.Model {
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
Event.init(
  {
    title: {
      type: S.DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: S.DataTypes.DATE,
      allowNull: false,
    },
    finishDate: {
      type: S.DataTypes.DATE,
      allowNull: false,
    },
    numberOfConfirmations: {
      type: S.DataTypes.INTEGER,
      allowNull: false,
    },
    details: {
      type: S.DataTypes.TEXT,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "Event" }
);

// Event.findEvent = (value) => {
//   return Event.findAll({
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

module.exports = Event;