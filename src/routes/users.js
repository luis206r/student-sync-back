const express = require("express");
const userController = require("../controllers/index.js");
const auth = require("../middleware/auth.js");
//import isAdminMiddleware from "../middlewares/isAdminMiddleware.ts";
//cuando se importa con import se debe exportar con export default, cuando se importa con require, se debe exportar con module.exports

const router = express.Router();

router.post("/register", userController.register);

router.post("/login", userController.login);

router.post("/logout", userController.logout);

router.get("/me", auth, userController.me);

//router.put("/update", auth, userController.updateUser);

module.exports = router;