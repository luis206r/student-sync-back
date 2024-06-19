const express = require("express");
//const reportController = require("../controllers/index.js");
const auth = require("../middleware/auth.js");
const controller = require("../controllers/index.js");
//import isAdminMiddleware from "../middlewares/isAdminMiddleware.ts";
//cuando se importa con import se debe exportar con export default, cuando se importa con require, se debe exportar con module.exports

const router = express.Router();

//a chat is an array of messages between 2 users, sorted by createdDate 


router.post("/create/:senderId/:receiverId", controller.messageController.create);

router.get("/loadChatMessages/:chatId/:page/:lastId?", controller.messageController.loadChatMessages); //ENTRE 2 USUARIOS

router.get("/getAllChats/:userId", controller.messageController.getAllChats); //PODRIA TRAER SOLO EL PRIMER MENSAJE DEL USUARIO

router.delete("/deleteMessage/:messageId", controller.messageController.deleteMessage);

router.post("/createChat/:user1Id/:user2Id", controller.messageController.createChat);



// router.put("/updateMessage/:messageId", controller.messageController.updateMessage)

// router.post("/modify", reportController.modify);

// router.delete("/delete", routerContoller.delete);

//router.get("/me", auth, userController.me);

//router.put("/update", auth, userController.updateUser);

module.exports = router;