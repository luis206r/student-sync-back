const db = require("../index");
const S = require("sequelize");

class Message extends S.Model {
}
//i can get de created date and modified date with the sequelize inner propierties
Message.init(
  {
    content: {
      type: S.DataTypes.TEXT,
      allowNull: false,
    },
    fileURL: { //only one file per message, this is a project!
      type: S.DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: S.DataTypes.STRING,
      allowNull: false,
      defaultValue: 'sent',
    },
    isDeleted: {
      type: S.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  },
  { sequelize: db, modelName: "Message" }
);

module.exports = Message;