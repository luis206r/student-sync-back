const db = require("../index");
const S = require("sequelize");
const bcrypt = require("bcrypt");

class User extends S.Model {
  generateHash(password, salt) {
    return bcrypt.hash(password, salt);
  }

  validatePassword(password) {
    return bcrypt
      .hash(password, this.salt)
      .then((hash) => hash === this.password);
  }
}

User.init(
  {
    name: {
      type: S.DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: S.DataTypes.STRING,
    },
    password: {
      type: S.DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: S.DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: S.DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: S.DataTypes.BOOLEAN,
      defaultValue: false,
    }
  },
  { sequelize: db, modelName: "user" }
);

User.findUsers = (value) => {
  return User.findAll({
    where: {
      [S.Op.or]: [
        { name: { [S.Op.iLike]: `%${value.toLowerCase()}%` } },
        { lastname: { [S.Op.iLike]: `%${value.toLowerCase()}%` } }
      ]
    }
  })
}

User.beforeCreate((usuario, options) => {
  const salt = bcrypt.genSaltSync(8);
  usuario.salt = salt;

  return usuario
    .generateHash(usuario.password, usuario.salt)
    .then((hash) => (usuario.password = hash));
});

User.beforeUpdate((usuario, options) => {
  return usuario
    .generateHash(usuario.password, usuario.salt)
    .then((hash) => (usuario.password = hash));
});

module.exports = User;