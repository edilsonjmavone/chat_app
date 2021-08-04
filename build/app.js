"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express_1 = __importDefault(require("express"));
var socketio = __importStar(require("socket.io"));
var http_1 = __importDefault(require("http"));
var path_1 = __importDefault(require("path"));
var app = express_1.default();
var port = process.env.PORT || 3333;
var server = http_1.default.createServer(app);
var io = new socketio.Server(server);
app.use(express_1.default.static(path_1.default.join(__dirname, "./public/")));
io.on("connection", function (socket) {
    console.log("Connected socket: " + socket.id);
    socket.on("msg", function (mesage) {
        io.emit('hey', mesage);
    });
});
server.listen(port, function () {
    return console.log("hello in port:" + port);
});
