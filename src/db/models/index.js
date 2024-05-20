//const Favorites = require("./Favorites");
const User = require("./User");
const Report = require("./Report");
const Task = require("./Task");


// User.belongsToMany(Favorites, { through: "user_favorites" });
// Favorites.belongsToMany(User, { through: "user_favorites" });

//Reports
User.hasMany(Report, { as: 'reportes', foreignKey: 'userId' });
Report.belongsTo(User, { foreignKey: 'userId' });

//Tasks
User.hasMany(Task, { as: 'tareas', foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Report, Task };