//const Favorites = require("./Favorites");
const User = require("./User");


// User.belongsToMany(Favorites, { through: "user_favorites" });
// Favorites.belongsToMany(User, { through: "user_favorites" });

module.exports = { User };