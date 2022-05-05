import "dotenv/config";
import express from "express";
import socketio from "socket.io";
import http from "http";
import path from "path";
import {} from "cors";

const app = express();

const port = process.env.PORT || 3333;
const server = http.createServer(app);

const io = new socketio.Server(server, {
  cors: { origin: "*", credentials: true }
});
let usersCount = 0;

app.use(express.static(path.join(__dirname, "./public/")));

io.on("connection", (socket: any) => {
  console.log(`Connected socket: ${socket.id}`);
  usersCount++;
  io.emit("update", usersCount);
  /**
       * socket.on("user_ready", (data: any) =>{
          socket.broadcast.emit('new_client', data)
      } )
       */
  socket.on("msg", function(mesage: any) {
    io.emit("hey", mesage);
  });

  socket.on("disconnect", (socket: any) => {
    console.log(`disconnected socket: ${socket.id}`);
    usersCount--;
    io.emit("update", usersCount);
  });
});

server.listen(port, () => console.log(`hello in port:${port}`));
