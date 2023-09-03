const io = require("socket.io")(8000);
const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(__dirname));

users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (userName) => {
    console.log(`${userName} joined the chat`);
    users[socket.id] = userName;
    socket.broadcast.emit("user-joined", userName);
  });

  socket.on("send-message", (msgText) => {
    socket.broadcast.emit("receive", {
      message: msgText,
      userName: users[socket.id],
    });
  });

  socket.on("disconnect", (message) => {
    console.log(`${users[socket.id]} left the chat`);
    socket.broadcast.emit("left-chat", users[socket.id]);
    delete users[socket.id];
  });
});

app.get("/", function (req, res) {
  console.log("We are here...");
  res.sendFile("index.html");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
