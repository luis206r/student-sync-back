const Report = require("../db/models/Report");
const generateToken = require("../config/token");
//const validate = require("../utils/validations");
//import { transporter } from "../config/mailTRansporter";
//import emailTemplates from "../utils/emailTemplates.ts";
//import { Payload } from "../types/userTypes";
const jwt = require("jsonwebtoken");
const { User } = require("../db/models");
//import Sequelize, { Op } from "sequelize";

const reportController = {
  create: async (req, res) => {
    const user = await User.findByPk(req.params.userId);
    if (!user) res.status(404).send({ message: 'User not found' });
    try {
      const {
        score,
        number,
        content,
      } = req.body;

      const newReport = await Report.create({
        score,
        number,
        content,
        userId: user.id
      });
      const reportResponse = { ...newReport.toJSON() };
      res.status(201).send(reportResponse);

    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  getReports: async (req, res) => {
    const user = await User.findByPk(req.params.userId);
    if (!user) res.status(404).send({ message: 'User not found' });
    try {

      const userReports = await Report.findAll({
        where: {
          userId: user.id
        }
      });

      //const reportResponse = { ...newReport.toJSON() };
      res.status(200).send(userReports);

    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  // login: async (req, res) => {
  //   const { email, password } = req.body;
  //   // if (!email) {
  //   //   return res.status(400).json({ message: "Email no proporcionado." });
  //   // }
  //   // if (!validate.email(email)) {
  //   //   return res
  //   //     .status(400)
  //   //     .json({ message: "El formato de correo electrónico es inválido." });
  //   // }
  //   // if (!password) {
  //   //   return res.status(400).json({ message: "Contraseña no proporcionada." });
  //   // }
  //   try {
  //     const existingUser = await User.findOne({ where: { email } });
  //     if (!existingUser) {
  //       return res.status(400).send({ error: "Usuario no encontrado." });
  //     }
  //     console.log("asd");
  //     const isOk = await existingUser.validatePassword(password);
  //     if (!isOk) return res.sendStatus(401);

  //     const existingUserToJson = existingUser.toJSON();

  //     const token = generateToken({
  //       id: existingUserToJson.id,
  //       isAdmin: existingUserToJson.isAdmin,
  //     });
  //     //res.cookie("token", token, { httpOnly: true });
  //     res.cookie("userToken", token);
  //     return res.status(200).json({
  //       message: "Usuario logeado con éxito.",
  //       isAdmin: existingUserToJson.isAdmin,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     return res.status(500).send({ error: "Error interno del servidor." });
  //   }
  // },
  // logout: async (req, res) => {
  //   if (!req.cookies.userToken) {
  //     return res.status(400).send({ message: "No hay sesión iniciada." });
  //   }
  //   res.clearCookie("userToken");
  //   return res
  //     .status(200)
  //     .send({ message: "Sesión cerrada satisfactoriamente." });
  // },
  // me: async (req, res) => {
  //   const userId = req.user.id;
  //   if (!userId) {
  //     return res.status(400).send({ message: "id no encontrado en el token." });
  //   }
  //   try {
  //     const user = await User.findOne({
  //       where: { id: userId },
  //       attributes: [
  //         "name",
  //         "lastname",
  //         "email",
  //         "isAdmin",
  //       ],
  //     });
  //     if (!user) {
  //       return res.status(404).json({ message: "Usuario no encontrado." });
  //     }
  //     return res
  //       .send({
  //         id: userId,
  //         ...user.get({ plain: true }),
  //       })
  //       .status(200);
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).send("Error de servidor");
  //   }
  // },
}

module.exports = reportController;