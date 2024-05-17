//const Favorites = require("./Favorites");
const User = require("./User");
const Report = require("./Report");


// User.belongsToMany(Favorites, { through: "user_favorites" });
// Favorites.belongsToMany(User, { through: "user_favorites" });
User.hasMany(Report, { as: 'reportes', foreignKey: 'userId' });
Report.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Report };