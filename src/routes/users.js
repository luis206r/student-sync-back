const express = require("express");
const controller = require("../controllers/index.js");
const auth = require("../middleware/auth.js");
//import isAdminMiddleware from "../middlewares/isAdminMiddleware.ts";
//cuando se importa con import se debe exportar con export default, cuando se importa con require, se debe exportar con module.exports

const router = express.Router();

router.post("/register", controller.userController.register);

router.post("/login", controller.userController.login);

router.post("/logout", controller.userController.logout);

router.get("/me", auth, controller.userController.me);

//router.put("/update", auth, userController.updateUser);

module.exports = router;