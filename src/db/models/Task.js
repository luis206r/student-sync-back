const db = require("../index");
const S = require("sequelize");

class Task extends S.Model {

}
//i can get de created date and modified date with the sequelize inner propierties
Task.init(
  {
    content: {
      type: S.DataTypes.TEXT,
      allowNull: false,
    },
    isCompleted: {
      type: S.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }
  },
  { sequelize: db, modelName: "Task" }
);



module.exports = Task;