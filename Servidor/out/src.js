"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express()
    .listen(PORT, () => { console.log(`Escuchando en ${PORT}`); });
let io = require("socket.io")(app, {
    cors: {
        origin: true,
        methods: ["GET", "POST"],
        credentials: false
    }
});
var messages = [];
io.on("connection", (socket) => {
    var timeout;
    console.log("nueva conexión");
    socket.on("observer", () => {
        console.log("Añadido observer");
        socket.join("observers");
    });
    socket.on("emmitter", () => {
        console.log("Añadido emmiter");
        socket.join("emmitters");
        timeout = setTimeout(() => {
            console.log("conexion lost");
            io.emit("conexionlost");
        }, 20000);
    });
    socket.on("newState", (state) => {
        if (socket.rooms.has("emmitters")) {
            messages = state;
            timeout.refresh();
            socket.to("observers").emit("messages", messages);
        }
    });
});
//# sourceMappingURL=src.js.map