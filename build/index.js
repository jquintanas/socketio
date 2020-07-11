"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const bodyParser = require("body-parser");
const path = require("path");
const SocketIO = require('socket.io');
var io;
const mensajes = [];
const usuarios = [];
const indexRouter_1 = __importDefault(require("./router/indexRouter"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.router();
    }
    config() {
        this.app.set("port", process.env.PORT || 3000);
        //static files
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'ejs');
        this.app.use(express_1.default.static(path.join(__dirname, '/public')));
        this.app.use(morgan_1.default("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }
    router() {
        this.app.use("/", indexRouter_1.default);
    }
    start() {
        this.server = this.app.listen(this.app.get("port"), () => {
            console.log("server on port: ", this.app.get("port"));
        });
        this.configSocketServer();
    }
    configSocketServer() {
        io = SocketIO.listen(this.server);
        io.on('connection', (socket) => {
            console.log("Nueva conexion de socket ID: " + socket.id);
            socket.on("iniciar", function (data) {
                usuarios.push({
                    user: data.nombre,
                    foto: data.foto,
                    id: socket.id
                });
                io.emit("conectados", usuarios);
                io.emit("entrada", mensajes);
            });
            socket.on('disconnect', function () {
                console.log("Se desconecto el usuario: " + socket.id);
            });
            socket.on('mensajeEnviado', function (data) {
                mensajes.push(data);
                io.emit("entrada", mensajes);
            });
        });
    }
}
const server = new Server();
server.start();
