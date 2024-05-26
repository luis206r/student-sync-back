const db = require("../index");
const S = require("sequelize");

class Group extends S.Model {
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
Group.init(
  {
    name: {
      type: S.DataTypes.STRING,
      allowNull: false,
    },
    numberOfMembers: {
      type: S.DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: S.DataTypes.TEXT,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "Group" }
);

// Group.findGroup = (value) => {
//   return Group.findAll({
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

module.exports = Group;