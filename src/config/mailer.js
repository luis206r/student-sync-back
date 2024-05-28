// require('dotenv').config();

// const nodemailer = require('nodemailer');

// const sendCode = (userMail) => {
//   let code = (Math.floor(Math.random() * 900000) + 100000).toString();
//   let transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//       user: "student.collab.app@gmail.com",
//       pass: "fcow zcxo gibo mdzc"
//     }
//   });

//   let mailOptions = {
//     from: process.env.MAIL, // remitente
//     to: userMail, // destinatario
//     subject: 'Código para cambiar contraseña',
//     text: `Usa el siguiente código para que puedas cambiar tu contraseña: ${code}`
//   };

//   return new Promise((resolve, reject) => {
//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         reject(error)
//       } else {
//         resolve({ info: info, code: code })
//       }
//     })
//   })
// }

// module.exports = sendCode;