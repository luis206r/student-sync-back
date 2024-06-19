const db = require("../index");
const S = require("sequelize");
const Message = require("./Message");
const User = require("./User");

class Chat extends S.Model {

  async loadChatMessages(page, lastId) {
    try {

      const user1 = await this.getUser1({
        attributes: ['id', 'name', 'lastname', 'profileImageUrl', 'email'] // Aquí especifica los atributos que deseas obtener
      });

      const user2 = await this.getUser2({
        attributes: ['id', 'name', 'lastname', 'profileImageUrl', 'email'] // Aquí especifica los atributos que deseas obtener
      });

      //====================== para paginas distinas a 1 es necesario capturar el lastId
      let messages;
      if (lastId && page > 1) {
        messages = await Message.findAndCountAll({
          where: {
            chatId: this.id,
            id: {
              [S.Op.lt]: lastId, // Obtener los registros con chatId menor que lastId
            },
          },
          order: [['createdAt', 'DESC']],
          limit: 25, //25 messages per page
          //offset: (page - 2) * 25,
        });
      }

      else {
        messages = await Message.findAndCountAll({
          where: {
            chatId: this.id,
          },
          order: [['createdAt', 'DESC']],
          limit: 25, //25 messages per page
          offset: (page - 1) * 25,
        });
      }
      let li = messages.rows.length >= 1 ? messages.rows[messages.rows.length - 1].id : 0;
      let p = messages.rows.length >= 1 ? Math.ceil(messages.count / 25) : 1;
      return {
        numberOfMessages: this.numberOfMessages,
        id: this.id,
        user1: user1,
        user2: user2,
        messages: messages.rows,
        totalCount: messages.count,
        currentPage: page,
        lastId: li,
        totalPages: p,
      }

    } catch (error) {
      console.error(`Error al obtener mensajes del chat ${this.id}:`, error);
      throw error;
    }
  }

}

Chat.init(
  {
    numberOfMessages: {
      type: S.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  { sequelize: db, modelName: "Chat" }
);



module.exports = Chat;