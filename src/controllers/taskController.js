const Report = require("../db/models/Report");
const generateToken = require("../config/token");
//const validate = require("../utils/validations");
//import { transporter } from "../config/mailTRansporter";
//import emailTemplates from "../utils/emailTemplates.ts";
//import { Payload } from "../types/userTypes";
const jwt = require("jsonwebtoken");
const { User, Task } = require("../db/models");
//import Sequelize, { Op } from "sequelize";

const taskController = {
  create: async (req, res) => {
    const user = await User.findByPk(req.params.userId);
    if (!user) res.status(404).send({ message: 'User not found' });
    try {
      const {
        status,
        content,
      } = req.body;

      const newTask = await Task.create({
        status,
        content,
        userId: user.id
      });
      const taskResponse = { ...newTask.toJSON() };
      res.status(201).send(taskResponse);

    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  getTasks: async (req, res) => {
    const user = await User.findByPk(req.params.userId);
    if (!user) res.status(404).send({ message: 'User not found' });
    try {

      const userTasks = await Task.findAll({
        where: {
          userId: user.id
        }
      });

      //const reportResponse = { ...newReport.toJSON() };
      res.status(200).send(userTasks);

    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
}

module.exports = taskController;