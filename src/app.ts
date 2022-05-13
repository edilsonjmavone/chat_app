import "dotenv/config";
import express from "express";
import socketio from "socket.io";
import http from "http";
import path from "path";
import cors from "cors";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);
const io = new socketio.Server(server, {
  cors: { origin: "*", credentials: true }
});
app.use(express.static(path.join(__dirname, "./public/")));
app.use(cors({ credentials: true }));

let usersCount = 0;
type userDat = {
  id: string;
  name?: string;
  room?: string | null;
  online?: boolean;
};
type SocketMsgData = {
  key: string;
  message: string;
  author: string;
  to: string;
};
type MsgPayload = {
  message: SocketMsgData;
  isPrivate: Boolean;
  room?: string;
  socketId?: string;
};
let usersList: userDat[] = [];

function findUser(userID: string): userDat | undefined {
  return usersList.find(user => user.id == userID);
}
function addUser(userDat: userDat): void {
  usersList.push(userDat);
}
function removeUser(userID: string): void {
  usersList = usersList.filter(user => user.id == userID);
}

function updateUserData(
  id: string,
  name?: string,
  room?: string | null,
  online?: boolean
) {
  name && (usersList[usersList.findIndex(user => user.id == id)].name = name);
  room && (usersList[usersList.findIndex(user => user.id == id)].room = room);
  online &&
    (usersList[usersList.findIndex(user => user.id == id)].online = online);
}

io.on(
  "connection",
  (
    socket: socketio.Socket<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap,
      any
    >
  ) => {
    console.log(`Connected socket: ${socket.id}`);
    addUser({ id: socket.id }); // setup server state
    io.emit("update", { usersCount, usersList }); // emit server state to clients

    function switchRomm(socketId: string, payload: any) {
      // func 'findUser' can return 'undefined' in that case we wanna exit out
      let user = findUser(socketId);
      if (!user) return console.log("couldn't find user");
      user.room && socket.leave(user.room);

      socket.join(payload.roomID);
      updateUserData(socketId, undefined, payload.roomID);
      io.emit("update", { usersCount, usersList });
      io.to(payload.roomID).emit("newUser", "new user joined");
      io.emit("update", { usersCount, usersList });
    }

    socket.on("join room", (payload: any) => {
      console.log(`Socket: ${socket.id} in room ${payload.roomID}`);
      switchRomm(socket.id, payload);
    });

    socket.on("leave room", (payload: any) => {
      socket.leave(payload.roomI);
      console.log(`leave ${payload.roomI}`);
    });

    socket.on("msg", (payload: MsgPayload) => {
      io.emit("eventMsg", payload);
      if (payload.isPrivate) {
        socket.to(payload.socketId!).emit("incomignMsg", payload.message);
        console.log(
          `${socket.id} says: ${payload.message.message} to ${payload.socketId}`
        );
        console.log(socket.rooms);
      } else {
        socket.to(payload.room!).emit("incomignMsg", payload.message);
        console.log(
          `${socket.id} says: ${payload.message.message} in ${payload.room}`
        );
        console.log(socket.rooms);
      }
    });
    function err(error: any) {
      //should be called when ever there is an internal server error
      io.to(socket.id).emit("ERROR", error);
    }

    socket.on("disconnect", () => {
      console.log(`Disconnected socket: ${socket.id}`);
      removeUser(socket.id);
      io.emit("update", { usersCount, usersList });
    });
  }
);

// setInterval(() => io.emit("update", { usersCount, usersList }), 4000);

server.listen(port, () => console.log(`hello in port:${port}`));
