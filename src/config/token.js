const jwt = require("jsonwebtoken");
//import { Payload } from "../types/userTypes";

const generateToken = (payload) => {
  const token = jwt.sign({ user: payload }, process.env.JWT_SECRET || 'milanesa', { expiresIn: '2d' });
  return token;
};

module.exports = generateToken;