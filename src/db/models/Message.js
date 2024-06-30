const { decrypt, encrypt } = require("../../utils/messageCrypt");
const db = require("../index");
const S = require("sequelize");
const secret = process.env.ENCRYPT_SECRET;

class Message extends S.Model {
  decryptedContent() {
    return decrypt(this.content, secret);
  }
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

Message.beforeCreate((message, options) => {
  const encryptedContent = encrypt(message.content, secret);
  message.content = encryptedContent; // Modifica directamente el atributo 'content' del mensaje
});

module.exports = Message;