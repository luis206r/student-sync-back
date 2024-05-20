const express = require("express");
const userRouter = require("./users");
const reportRouter = require("./reports")
const taskRouter = require("./reports")
// import packagesRouter from "./packages";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Api funcionando!" }).status(200);
});

router.use("/users", userRouter);
router.use("/reports", reportRouter);
router.use("/tasks", taskRouter);
//router.use("/packages", packagesRouter);

module.exports = router;