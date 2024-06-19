const { User, Follower } = require("../db/models");

//const validate = require("../utils/validations");
//import { transporter } from "../config/mailTRansporter";
//import emailTemplates from "../utils/emailTemplates.ts";
//import { Payload } from "../types/userTypes";
const jwt = require("jsonwebtoken");
const { Psycho } = require("../db/models");
const { UtecMember } = require("../db/models");
const { Student } = require("../db/models");
const { Teacher } = require("../db/models");
const getUserTokenFromHeaders = require("../utils/getToken");
const { generateToken } = require("../config/token");
const { response } = require("../../server");
//import Sequelize, { Op } from "sequelize";

const userRoleModels = {
  student: Student,
  teacher: Teacher,
  psycho: Psycho,
  other: UtecMember
};

const userRoleGetMethods = {
  student: "getStudentInfo",
  teacher: "getStudentInfo",
  psycho: "getStudentInfo",
  other: "getStudentInfo"
};

const userController = {
  register: async (req, res) => {

    try {
      const { email, name, lastname, isAdmin, role, major, area, courses, spec, password } = req.body;

      // if (!validate.email(email)) {
      //   return res
      //     .status(400)
      //     .json({ message: "El email tiene un formato incorrecto." });
      // }

      const existingUser = await User.findOne({ where: { email } });
      if (!existingUser) {

        const newUser = await User.create({
          name,
          lastname,
          email,
          isAdmin, role,
          password,
          isAdmin,
          //profileImage,
        });
        let newRole;
        if (role == "psycho") {
          newRole = await Psycho.create({
            spec,
            major,
            userId: newUser.id
          });
        }
        else if (role == "other") {
          newRole = await UtecMember.create({
            area,
            major,
            userId: newUser.id
          });
        }
        else if (role == "teacher") {
          newRole = await Teacher.create({
            courses,
            major,
            userId: newUser.id
          });
        }
        else if (role == "student") {
          newRole = await Student.create({
            major,
            userId: newUser.id
          });
        }
        return res.status(201).send({ newUser, newRole });
      }
      else {
        return res.send({ message: "este correo ya está registrado" }).status(400);
      }
      //const mailOptions = emailTemplates.welcome(userResponse);
      //await transporter.sendMail(mailOptions);

    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    // if (!email) {
    //   return res.status(400).json({ message: "Email no proporcionado." });
    // }
    // if (!validate.email(email)) {
    //   return res
    //     .status(400)
    //     .json({ message: "El formato de correo electrónico es inválido." });
    // }
    // if (!password) {
    //   return res.status(400).json({ message: "Contraseña no proporcionada." });
    // }
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (!existingUser) {
        return res.status(400).send({ error: "Usuario no encontrado." });
      }
      console.log("asd");
      const isOk = await existingUser.validatePassword(password);
      if (!isOk) return res.sendStatus(401);

      const existingUserToJson = existingUser.toJSON();

      const payload = {
        id: existingUserToJson.id,
        isAdmin: existingUserToJson.isAdmin,
        role: existingUserToJson.role
      }

      const token = generateToken(payload);
      //res.cookie("token", token, { httpOnly: true });
      // res.cookie("userToken", token);
      return res.status(200).send({
        message: "Usuario logeado con éxito.",
        isAdmin: existingUserToJson.isAdmin,
        isRegistered: true,
        token: token
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  googleLogin: async (req, res) => {
    const { email, profileImageUrl } = req.body;
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (!existingUser) {
        return res.status(400).send({ message: "Usuario no registrado", isRegistered: false });
      }

      if (existingUser.profileImageUrl != profileImageUrl) {
        existingUser.profileImageUrl = profileImageUrl;
        await existingUser.save();
      }
      const existingUserToJson = existingUser.toJSON();

      const payload = {
        id: existingUserToJson.id,
        isAdmin: existingUserToJson.isAdmin,
        role: existingUserToJson.role
      }

      const token = generateToken(payload);
      //res.cookie("token", token, { httpOnly: true });
      // res.cookie("userToken", token);
      return res.status(200).send({
        message: "Usuario logeado con éxito.",
        isAdmin: existingUserToJson.isAdmin,
        isRegistered: true,
        token: token
      });

    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  googleRegister: async (req, res) => {
    const { email, name, lastname, profileImageUrl, isAdmin, role, major, area, courses, spec, password } = req.body;
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (!existingUser) {
        const newUser = await User.create({
          name,
          lastname,
          email,
          isAdmin,
          profileImageUrl,
          role,
          password,
          hasGoogleAcces: true,
        });
        let newRole;
        if (role == "psycho") {
          newRole = await Psycho.create({
            spec,
            major,
            userId: newUser.id
          });
        }
        else if (role == "other") {
          newRole = await UtecMember.create({
            area,
            major,
            userId: newUser.id
          });
        }
        else if (role == "teacher") {
          newRole = await Teacher.create({
            courses,
            major,
            userId: newUser.id
          });
        }
        else if (role == "student") {
          newRole = await Student.create({
            major,
            userId: newUser.id
          });
        }
        //newRole.setUser(newUser);

        return res.status(201).send({ newUser, newRole });
      }
      else {
        return res.send({ message: "este correo ya está registrado" }).status(400);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  logout: async (req, res) => {
    try {

      res.clearCookie("userToken");
      return res
        .status(200)
        .send({ message: "Sesión cerrada satisfactoriamente." });

    }
    catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }

  },
  // me: async (req, res) => {

  //   try {
  //     const id = req.user.id;
  //     const role = req.user.role;
  //     if (!id) {
  //       return res.status(400).send({ message: "id no encontrado en el token." });
  //     }
  //     else {
  //       const user = await User.findOne({
  //         where: { id: id },
  //         attributes: [
  //           "name",
  //           "lastname",
  //           "email",
  //           "isAdmin",
  //           "profileImageUrl",
  //           "role"
  //         ],
  //         include: [
  //           {
  //             model: role === "student" ? Student : role === "teacher" ? Teacher : role === "psycho" ? Psycho : UtecMember,
  //             required: false,
  //             as: `${role}Info`,

  //           },
  //           {
  //             model: User,
  //             as: "followers",
  //             through: { model: Follower, attributes: [] },
  //             foreignKey: "followedId",
  //             attributes: ["id", "email", "name", "lastname", "profileImageUrl", "role"]
  //           },
  //           {
  //             model: User,
  //             as: "follows",
  //             through: { model: Follower, attributes: [] },
  //             foreignKey: "followerId",
  //             attributes: ["id", "email", "name", "lastname", "profileImageUrl", "role"]
  //           }
  //         ]
  //       });
  //       if (!user) {
  //         return res.status(404).json({ message: "Usuario no encontrado." });
  //       }

  //       return res.status(200).send({
  //         id: id,
  //         ...user.get({ plain: true }),
  //       })
  //         .status(200);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).send("Error de servidor");
  //   }
  // },
  me: async (req, res) => {
    try {
      const id = req.user.id;
      const role = req.user.role;

      if (!id) {
        return res.status(400).send({ message: "ID no encontrado en el token." });
      } else {
        const user = await User.findOne({
          where: { id: id },
          attributes: [
            "name",
            "lastname",
            "email",
            "isAdmin",
            "profileImageUrl",
            "role"
          ],
          include: [
            {
              model: role === "student" ? Student : role === "teacher" ? Teacher : role === "psycho" ? Psycho : UtecMember,
              required: false,
              as: `${role}Info`,
            },
            {
              model: User,
              as: "followers",
              through: { attributes: [] }, // No se requieren atributos de la tabla de relaciones
              foreignKey: "followedId",
              attributes: ["id", "email", "name", "lastname", "profileImageUrl", "role"]
            },
            {
              model: User,
              as: "follows",
              through: { attributes: [] }, // No se requieren atributos de la tabla de relaciones
              foreignKey: "followerId",
              attributes: ["id", "email", "name", "lastname", "profileImageUrl", "role"]
            }
          ]
        });

        if (!user) {
          return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Convertir el usuario a un objeto plano
        const userData = user.get({ plain: true });

        // Agregar la propiedad 'status' con un valor predeterminado a cada follower y follow
        userData.followers = userData.followers.map(follower => ({
          ...follower,
          status: "" // Puedes establecer cualquier valor predeterminado que desees
        }));

        userData.follows = userData.follows.map(follow => ({
          ...follow,
          status: "" // Puedes establecer cualquier valor predeterminado que desees
        }));

        return res.status(200).send({
          id: id,
          status: "",
          ...userData,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error de servidor");
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const students = await User.findAll({
        where: { role: "student" },
        include: [
          {
            model: Student,
            as: `studentInfo`,
          }
        ]
      });
      const teachers = await User.findAll({
        where: { role: "teacher" },
        include: [
          {
            model: Teacher,
            as: `teacherInfo`,
          }
        ]
      });
      const psychos = await User.findAll({
        where: { role: "psycho" },
        include: [
          {
            model: Psycho,
            as: `psychoInfo`,
          }
        ]
      });
      const others = await User.findAll({
        where: { role: "other" },
        include: [
          {
            model: UtecMember,
            as: `otherInfo`,
          }
        ]
      });

      return res.status(200).send({ students: students, teachers: teachers, psychos: psychos, others: others });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error de servidor");
    }
  },
  findByEmail: async (req, res) => {

    try {
      const email = req.body.email;
      const user = await User.findOne({
        where: { email: email }
      });
      if (!user) {
        return res.status(404).send({ message: "Usuario no encontrado." });
      }
      return res.status(200).send({ message: "Usuario encontrado", user: user });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error de servidor");
    }
  },
  getUserInfo: async (req, res) => {

    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).send({ message: "id no encontrado en el token." });
      }

      let user = await User.findOne({
        where: { id: userId },
        attributes: [
          "id",
          "name",
          "lastname",
          "email",
          "isAdmin",
          "profileImageUrl",
          "role",
          "createdAt",
          "updatedAt"
        ],
      });

      // const userInfo = await userRoleModels[user.role].findOne({
      //   where: {
      //     userId: user.id,
      //   }
      // })

      const userInfo = await user[`${userRoleGetMethods[user.role]}`]();
      if (!user) {
        return res.status(400).send({ message: "id no encontrado en el token." });
      }
      return res.status(200).send({ ...user.dataValues, [`${user.role}Info`]: userInfo.dataValues });

    } catch (error) {
      console.error(error);
      return res.status(500).send("Error de servidor");
    }
  },
  addFollower: async (req, res) => {
    try {
      const { followUserId, followerUserId } = req.body;
      if (followUserId === followerUserId)
        return res.status(400).send({ message: "solicitud incorrecta" });
      else {
        //verificar existencia de usuarios
        const followUser = await User.findByPk(followUserId);
        const followerUser = await User.findByPk(followerUserId);

        if (!followUser || !followerUser) {
          return res.status(404).send({ message: "Uno o ambos usuarios no existen" });
        }
        else {
          const newFollow = await Follower.create({
            followedId: followUserId,
            followerId: followerUserId,
          });
          console.log(newFollow);
          return res.status(201).send({ message: "solicitud realizada correctamente" });
        }
      }
    }
    catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).send({ message: "La solicitud ya ha sido realizada previamente" });
      } else {
        console.error(err);
        return res.status(500).send("Error de servidor");
      }
    }
  },
  removeFollower: async (req, res) => {
    try {
      const { followUserId, followerUserId } = req.body;
      if (followUserId === followerUserId)
        return res.status(400).send({ message: "solicitud incorrecta" });
      else {
        //verificar existencia de usuarios
        const followUser = await User.findByPk(followUserId);
        const followerUser = await User.findByPk(followerUserId);
        if (!followUser || !followerUser) {
          return res.status(404).send({ message: "Uno o ambos usuarios no existen" });
        }
        else {
          const removeFollower = await Follower.destroy({
            where: {
              followedId: followUserId,
              followerId: followerUserId,
            }
          });
          console.log(removeFollower);
          return res.status(200).send({ message: "solicitud realizada correctamente" });
        }
      }
    }
    catch (err) {
      console.error(err);
      return res.status(500).send("Error de servidor");
    }
  },
  getFollowers: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }

      let followers = await user.getFollowers();
      followers = followers.map(f => {
        const followerPlain = f.get({ plain: true }); // Convertir a objeto plano
        return { ...followerPlain, status: "" }; // Agregar la propiedad 'status'
      });

      return res.status(200).send({ followers: followers });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error de servidor");
    }
  },
  getFollows: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }

      let follows = await user.getFollows();
      follows = follows.map(f => {
        const followPlain = f.get({ plain: true }); // Convertir a objeto plano
        return { ...followPlain, status: "" }; // Agregar la propiedad 'status'
      });

      return res.status(200).send({ follows: follows });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error de servidor");
    }
  }

}

module.exports = userController;