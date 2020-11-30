import { Injectable } from '@angular/core';
import { observable, Observable } from 'rxjs';
import { connect } from 'socket.io-client';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class MessageService {

    private localState:string[]=[];
    private socket:SocketIOClient.Socket;
    private interval;
    private modified:boolean;

    constructor() { 
        this.socket = connect(environment.urlServer)
        this.socket.on("connect",()=>{
            this.modified=false;
            this.socket.emit("emmitter");
            this.updateState(this.localState);
            this.interval = setInterval(()=>{
                this.updateState(this.localState);
            },5000)
        })
        this.socket.on("disconect",()=>{
            console.log("Server disconected");
            this.interval.unref();
        })

        this.socket.on("initialState", (messages)=>{
            this.localState=messages;
            this.modified=true;
        })
    }

    listenChanges(): Observable<string[]>{
        return new Observable(observable =>{
            this.socket.on("messages",(messages:string[])=>{
                observable.next(messages)
            })
        })
    }

    updateState(state:string[]){
        this.socket.emit("newState", {updated:this.modified, state:this.localState})
        console.log("Estado actualizado")
        this.modified=false;
    }

    addMessage(message:string){
        this.localState.push(message)
        this.modified=true;
    }
    

}







































