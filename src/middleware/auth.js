//import { Payload } from "../types/userTypes";
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {

  const token = req.cookies.userToken;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(400).json({ message: "Token is not valid" });
  }
};

module.exports = auth;