//import { Payload } from "../types/userTypes";
const jwt = require("jsonwebtoken");
const getUserTokenFromHeaders = require("../utils/getToken");


const auth = async (req, res, next) => {


  // console.log("req header: ", req.headers)
  //const token = getUserTokenFromHeaders(req.headers);
  //console.log(token);
  const token = req.header('Authorization').substring('Bearer '.length);
  console.log("token ===>", token);

  if (!token) {
    console.log("there's no token");
    return res.sendStatus(401);
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, "milanesa");
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(400).json({ message: "Token is not valid" });
  }
};

module.exports = auth;