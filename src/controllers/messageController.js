const { Op } = require("sequelize");
const { Post, Content, User, Reaction, Comment, Message, Chat } = require("../db/models");
const { authorize, uploadFile, getFileDownloadUrl, deleteFileFromDrive } = require("../utils/driveUpload/driveUpload");
const fs = require('fs');


const messageController = {
  create: async (req, res) => {
    try {
      const { content } = req.body;
      const { senderId, receiverId } = req.params;
      if (!content || !senderId || !receiverId) { return res.status(404).send({ message: "incomplete params" }) }
      const senderUser = await User.findOne({ where: { id: senderId } });

      if (!senderUser) { return res.status(404).send({ message: "there's no sender user" }) }

      const receiverUser = await User.findOne({ where: { id: receiverId } });

      if (!receiverUser) { return res.status(404).send({ message: "there's no receiver user" }) }

      let chat = await Chat.findOne({
        where: {
          [Op.or]: [
            { user1Id: senderId, user2Id: receiverId },
            { user1Id: receiverId, user2Id: senderId }
          ]
        }
      });

      if (!chat) {
        chat = await Chat.create({});
        chat.setUser1(senderUser);
        chat.setUser2(receiverUser);
      }

      const message = await Message.create({
        content: content,
      });
      await message.setSender(senderUser);
      await message.setReceiver(receiverUser);

      message.setChat(chat);
      let n = chat.numberOfMessages;
      n++;

      await chat.update({
        updatedAt: message.createdAt, //para saber cual es el chat con actividad mas reciente 
        numberOfMessages: n, //
      })

      return res.status(201).send(message);
    }

    catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  deleteMessage: async (req, res) => {
    try {
      const { messageId } = req.params;
      if (!messageId) { return res.status(404).send({ message: "incomplete params" }) }
      const message = await Message.findOne({ where: { id: messageId } });
      if (!message) { return res.status(404).send({ message: "there's no message" }) }
      await message.destroy();
      return res.status(200).send({ message: "message was deleted" });
    }
    catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  loadChatMessages: async (req, res) => { //works :')
    try {
      const { chatId, page, lastId } = req.params;

      if (!chatId || !page) { return res.status(404).send({ message: "incomplete params" }) }

      if (page > 1 && !lastId) { return res.status(404).send({ message: "you must provide lastId for pages 2-n" }) }

      const chat = await Chat.findOne({
        where: { id: chatId }
      });

      if (!chat) return res.status(404).send({ message: "there's no chat" });

      const resObj = await chat.loadChatMessages(page, lastId);

      return res.status(200).send(resObj)

      //======================

    }
    catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  getAllChats: async (req, res) => { //trae los primeros mensajes de cada chat, o los ultimos mensajes no leídos de cada chat.
    try {
      const { userId } = req.params;
      if (!userId) { return res.status(404).send({ message: "incomplete params" }) }
      const user = await User.findOne({ where: { id: userId } });

      if (!user) { return res.status(404).send({ message: "there's no sender user" }) }

      const chats = await Chat.findAll({
        where: {
          [Op.or]: [
            { user1Id: user.id },
            { user2Id: user.id }
          ],
          // numberOfMessages: {
          //   [Op.gt]: 0, // Obtener los registros con chatId menor que lastId
          // },
        },
        order: [['updatedAt', 'DESC']],
      })

      let chatsLoad = await Promise.all(chats.map(async (chat) => {
        try {
          let t = await chat.loadChatMessages(1);
          return t;
        }
        catch (err) { console.error(err) }
      }))

      res.status(200).send(chatsLoad);

      // const chatsFiltered = await Promise.all(chats.map(async (chat) => {
      //   try {
      //     const { unread, messages, hmm } = await chat.getPrevMessages();
      //     const user1 = await chat.getUser1({
      //       attributes: ['id', 'name', 'lastname', 'profileImageUrl', 'email'] // Aquí especifica los atributos que deseas obtener
      //     });

      //     // Obtener user2 y seleccionar solo algunos atributos
      //     const user2 = await chat.getUser2({
      //       attributes: ['id', 'name', 'lastname', 'profileImageUrl', 'email'] // Aquí especifica los atributos que deseas obtener
      //     });

      //     return { chatId: chat.id, user1: user1, user2: user2, unread: unread, messages: messages, hmm: hmm };
      //   } catch (error) {
      //     console.error(`Error obteniendo mensajes del chat ${chat.id}:`, error);
      //     return { chatId: chat.id, messages: [] }; // Manejar el error o retornar un array vacío en caso de falla
      //   }
      // }));


      // res.status(200).send(chatsFiltered);
    }
    catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  createChat: async (req, res) => {
    try {
      const { user1Id, user2Id } = req.params;
      if (!user1Id || !user2Id) return res.status(500).send({ error: "incomplete params" })

      const user1 = await User.findOne({ where: { id: user1Id } })

      if (!user1) return res.status(500).send({ error: "there no user 1" });

      const user2 = await User.findOne({ where: { id: user2Id } })

      if (!user2) return res.status(500).send({ error: "there no user 2" });

      const chat = await Chat.findOne({
        where: {
          [Op.or]: [
            { user1Id: user1.id, user2Id: user2.id },
            { user1Id: user2.id, user2Id: user1.id }
          ]
        }
      });

      if (chat) {
        const resObj = await chat.loadChatMessages(1);
        return res.status(200).send(resObj);
      }

      const newChat = await Chat.create({});
      await newChat.setUser1(user1);
      await newChat.setUser2(user2);

      const resObj = await newChat.loadChatMessages(1);
      return res.status(201).send(resObj);
    }
    catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  }
}

module.exports = messageController;