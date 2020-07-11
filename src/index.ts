import express, { Application } from "express";
import morgan from "morgan";
const bodyParser = require("body-parser");
const path = require("path");
const SocketIO = require('socket.io');

var io:any;
const mensajes: any[] = [
];
const usuarios: any[] = [
]

import routerIndex from "./router/indexRouter"
class Server {
    public app: Application;
    public server: any;
    constructor() {
        this.app = express();
        this.config();
        this.router();
    }

    config(): void {
        this.app.set("port", process.env.PORT || 3000);
        //static files
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'ejs');
        this.app.use(express.static(path.join(__dirname, '/public')));
        this.app.use(morgan("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    router(): void {
        this.app.use("/", routerIndex);
    }

    start(): void {
        this.server = this.app.listen(this.app.get("port"), () => {
            console.log("server on port: ", this.app.get("port"));
        });
        this.configSocketServer();
    }

    configSocketServer() {
        io = SocketIO.listen(this.server)
        io.on('connection', (socket: any) => {
            console.log("Nueva conexion de socket ID: " + socket.id);
            socket.on("iniciar", function (data: any) {
                usuarios.push(
                    {
                        user: data.nombre,
                        foto: data.foto,
                        id: socket.id
                    }
                );
                io.emit("conectados", usuarios);
                io.emit("entrada", mensajes);
            })

            socket.on('disconnect', function () {
                console.log("Se desconecto el usuario: " + socket.id);
            });

            socket.on('mensajeEnviado', function (data: any) {
                mensajes.push(data);
                io.emit("entrada", mensajes);
            });

        });
    }

}
const server = new Server();
server.start();







