// Configuración del server
const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const morgan = require("morgan");
const routes = require("./src/routes");
const db = require("./src/db/index");
const cors = require("cors");
const envs = require("./src/config/envs");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(cors({ origin: "https://student-collab.vercel.app", credentials: true })); // para comunicar entre puertos
//app.use(cors({ origin: "http://localhost:5173", credentials: true })); // para comunicar entre puertos
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny"));
app.use("/api", routes);

app.get("/test", (req, res) => {
  res.send("Hello, World!");
})

//===================socket.io================================================

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    //origin: "http://localhost:5173", // Origen permitido para conexiones WebSocket
    origin: "https://student-collab.vercel.app",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
  }
});

//============================================================================


db.sync({ force: false })
  .then(() => {
    server.listen(8000, () => {
      console.log("Escuchando en el puerto 8000");
    });
  });

// Manejar conexiones WebSocket ==============================================

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  //================= online offline status=======================
  socket.on("new-user-connected", (newUserId) => {
    if (!onlineUsers.some((user) => user.userId === newUserId)) {
      // if user is not added before
      onlineUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("new user is here!", onlineUsers);
    }
    // send all active users to new user
    io.emit("get-connected-users", onlineUsers);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
    console.log("user disconnected", onlineUsers);
    // send all online users to all users
    io.emit("get-connected-users", onlineUsers);
  });

  socket.on("offline", () => {
    // remove user from active users
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
    console.log("user is offline", onlineUsers);
    // send all online users to all users
    io.emit("get-users", onlineUsers);
  });

  //========================================================================

  // Aquí puedes manejar eventos de Socket.io, como recibir y emitir mensajes
  socket.on("message", (data) => {
    console.log("mensaje recibido: ", data);
    const existUser = onlineUsers.filter((user) => user.userId === data.receiverId)[0];
    if (existUser) {
      socket.to(existUser.socketId).emit('message', data)
      //socket.broadcast.emit('message', data);
    }
    //const { message, receiverId, senderId } = data;
    //console.log("Mensaje recibido:", message);

    // Aquí puedes emitir el mensaje a todos los clientes conectados
    //io.emit("chat message", msg);
  });

  socket.on("newChatMessage", (data) => { //{message, chat}
    console.log("mensaje de nuevo chat recibido: ", data);
    const existUser = onlineUsers.filter((user) => user.userId === data.message.receiverId)[0];
    if (existUser) {
      socket.to(existUser.socketId).emit('newChatMessage', data)
      //socket.broadcast.emit('newChatMessage', data);
    }
    //const { message, receiverId, senderId } = data;
    //console.log("Mensaje recibido:", message);
    // Aquí puedes emitir el mensaje a todos los clientes conectados
    //io.emit("chat message", msg);
  });

});

module.exports = app;
