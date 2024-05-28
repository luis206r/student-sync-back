const express = require("express");
const controller = require("../controllers/index.js");
const auth = require("../middleware/auth.js");
const preLogout = require("../middleware/preLogout.js");
//import isAdminMiddleware from "../middlewares/isAdminMiddleware.ts";
//cuando se importa con import se debe exportar con export default, cuando se importa con require, se debe exportar con module.exports

const router = express.Router();

router.post("/register", controller.userController.register);

router.post("/login", controller.userController.login);
router.post("/googleLogin", controller.userController.googleLogin);
router.post("/googleRegister", controller.userController.googleRegister);

router.post("/logout", preLogout, controller.userController.logout);

router.get("/me", auth, controller.userController.me);
router.get("/getAllUsers", controller.userController.getAllUsers);
router.post("/findEmail", controller.userController.findByEmail);


//router.put("/update", auth, userController.updateUser);

module.exports = router;