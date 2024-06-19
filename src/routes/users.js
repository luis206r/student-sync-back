const express = require("express");
const controller = require("../controllers/index.js");
const auth = require("../middleware/auth.js");
const preLogout = require("../middleware/preLogout.js");
//import isAdminMiddleware from "../middlewares/isAdminMiddleware.ts";
//cuando se importa con import se debe exportar con export default, cuando se importa con require, se debe exportar con module.exports

const router = express.Router();

//user default routes
router.post("/register", controller.userController.register);
router.post("/login", controller.userController.login);
router.post("/googleLogin", controller.userController.googleLogin);
router.post("/googleRegister", controller.userController.googleRegister);
router.post("/logout", controller.userController.logout);
router.get("/me", auth, controller.userController.me);
router.get("/getAllUsers", controller.userController.getAllUsers);
router.post("/findEmail", controller.userController.findByEmail);
router.get("/:userId", controller.userController.getUserInfo);

//followes and follows routes
router.post("/addFollower", controller.userController.addFollower); //añadir seguidor a un usuario
router.post("/removeFollower", controller.userController.removeFollower); //remover seguidor a un usuario
router.get("/getFollowers/:userId", controller.userController.getFollowers);//lista de seguidores
router.get("/getFollows/:userId", controller.userController.getFollows);//lista de seguidos

//router.put("/update", auth, userController.updateUser);

module.exports = router;