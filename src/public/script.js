const chatMsgs = [];
const url = window.location.href;
const socket = io(url);
const sub = document.querySelector("#submit");
const cUserName = "user_name";
let room = "music";
console.log(sub.value);

socket.on("connect", () => {
  console.log("Connected");
  // socket.emit("join room", { room, name: "Edilson" });
});

function joinRoom(roomI) {
  // join new room
  room = roomI;
  socket.emit("join room", {
    roomI,
    name: "Edilson",
    calback: (socketInstance, message) => {
      socketInstance.emit("calback", message);
    }
  });
}

socket.on("calback", message => {
  console.log(message);
});

function leaveRoom(roomI) {
  socket.emit("leave room", { roomI, name: "Edilson" });
}
let name = sub.textContent;

socket.on("hey", message => {
  console.log(message);
});

socket.on(() => console.log("server said NULL"));
setInterval(() => {
  // socket.emit("msg", { message: `[${name}]`, room });
}, 4000);
