const express = require("express");
//const reportController = require("../controllers/index.js");
const auth = require("../middleware/auth.js");
const controller = require("../controllers/index.js");
//import isAdminMiddleware from "../middlewares/isAdminMiddleware.ts";
//cuando se importa con import se debe exportar con export default, cuando se importa con require, se debe exportar con module.exports
const multer = require('multer');
const upload = multer();
const router = express.Router();

router.post("/createPost/:userId", upload.single('file'), controller.contentController.createPost);
router.get("/getTest", controller.contentController.testGetUrl);
router.get("/getPosts", controller.contentController.getPosts);
router.delete("/deletePost/:contentId", controller.contentController.deletePost);


module.exports = router;  