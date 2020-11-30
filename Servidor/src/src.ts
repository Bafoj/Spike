import * as express from 'express'


const PORT = process.env.PORT || 3000;
const app = express()
.listen(PORT ,()=>{console.log(`Escuchando en ${PORT}`);}
);



let io = require("socket.io")(app, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: false

  }
});

var messages:string[]= [];

io.on("connection", (socket) => {
var timeout;
  console.log("nueva conexión");
  
  socket.on("observer",()=>{
    console.log("Añadido observer");
    
    socket.join("observers")
  })

  socket.on("emmitter",()=>{
    console.log("Añadido emmiter");
    socket.join("emmitters")
    socket.join("observers")
    timeout = setTimeout(()=>{
    console.log("conexion lost");
    
    io.emit("conexionlost")
    },20000)
  })

  socket.on("newState", (state:string[])=>{
    if( socket.rooms.has("emmitters")){
      messages = state
      timeout.refresh();
      console.log(messages)
      io.emit("messages", messages);
    }
  })

 
});




