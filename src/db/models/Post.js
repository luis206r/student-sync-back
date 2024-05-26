const db = require("../index");
const S = require("sequelize");
const Content = require("./Content");

class Post extends S.Model {
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
Post.init(
  {
    content: {
      type: S.DataTypes.STRING,
      allowNull: false,
    },
    images: { //images url
      type: S.DataTypes.ARRAY(S.DataTypes.STRING),
      allowNull: true,
    },
  },
  { sequelize: db, modelName: "Post" }
);

// Post.findPost = (value) => {
//   return Post.findAll({
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

module.exports = Post;