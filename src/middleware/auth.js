//import { Payload } from "../types/userTypes";
const jwt = require("jsonwebtoken");
const getUserTokenFromHeaders = require("../utils/getToken");

const auth = async (req, res, next) => {


  console.log("req: ", req)
  const token = getUserTokenFromHeaders(req.headers);
  console.log(token);

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
