const jwt = require("jsonwebtoken");
//import { Payload } from "../types/userTypes";

const generateToken = (payload) => {
  const token = jwt.sign({ user: payload }, "milanesa", { expiresIn: '6d' });
  return token;
};

const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, "milanesa");
    return decoded.user;
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, validateToken };