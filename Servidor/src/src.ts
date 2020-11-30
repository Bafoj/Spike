import * as express from 'express'
import firebase from 'firebase'

const PORT = process.env.PORT || 3000;
const app = express()
.listen(PORT ,()=>{console.log(`Escuchando en ${PORT}`);}
);

var firebaseapp = firebase.initializeApp({
  apiKey: "AIzaSyAo_npbOyiYZ5UELsvXnUuagIDvQmAFbes",
  authDomain: "servidor-8d38d.firebaseapp.com",
  databaseURL: "https://servidor-8d38d.firebaseio.com",
  projectId: "servidor-8d38d",
  storageBucket: "servidor-8d38d.appspot.com",
  messagingSenderId: "994168874382",
  appId: "1:994168874382:web:68407e278d6e4b9a65f0df",
  measurementId: "G-CCQSLTK9TL"});
  var firestore = firebaseapp.firestore();

let io = require("socket.io")(app, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: false

  }
});

var messages:string[]= [];

var a = firestore.collection('mensajes').doc('estado').get().then(doc => {
  messages=doc.data().messages;
  startServer()
  })

function startServer() {

  io.on("connection", (socket) => {
    var timeout;
      console.log("nueva conexión");
      console.log(messages)
      socket.emit("initialState", messages)
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
    
      socket.on("newState", (state)=>{
        if( socket.rooms.has("emmitters")){
          timeout.refresh();
          if (state.updated) {
            messages = state.state
            firestore.collection('mensajes').doc('estado').set({messages:messages});
            console.log(messages)
            io.emit("messages", messages);
          }
          
        }
      })
    });

}






