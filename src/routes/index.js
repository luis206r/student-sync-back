const express = require("express");
const userRouter = require("./users");
// import packagesRouter from "./packages";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Api funcionando!" }).status(200);
});

router.use("/users", userRouter);
//router.use("/packages", packagesRouter);

module.exports = router;