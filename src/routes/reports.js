const express = require("express");
//const reportController = require("../controllers/index.js");
const auth = require("../middleware/auth.js");
const controller = require("../controllers/index.js");
//import isAdminMiddleware from "../middlewares/isAdminMiddleware.ts";
//cuando se importa con import se debe exportar con export default, cuando se importa con require, se debe exportar con module.exports

const router = express.Router();

router.post("/create/:userId", controller.reportController.create);

router.get("/getReports/:userId", controller.reportController.getReports);

// router.post("/modify", reportController.modify);

// router.delete("/delete", routerContoller.delete);

//router.get("/me", auth, userController.me);

//router.put("/update", auth, userController.updateUser);

module.exports = router;