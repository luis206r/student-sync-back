//import { Payload } from "../types/userTypes";
const jwt = require("jsonwebtoken");
const getUserTokenFromHeaders = require("../utils/getToken");

const preLogout = async (req, res, next) => {


  console.log("req header: ", req.headers)
  const token = getUserTokenFromHeaders(req.headers);
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "No token, can not logout" });
  }
  try {

    req.userToken = token;
    next();
  } catch (error) {
    res.status(400).json({ message: "Something was wrong..." });
  }
};

module.exports = preLogout;