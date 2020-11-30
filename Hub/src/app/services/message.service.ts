import { Injectable } from '@angular/core';
import { observable, Observable } from 'rxjs';
import { io } from 'socket.io-client/dist/socket.io';
import { environment } from '../../environments/environment';
import { startWith } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

    private localState:string[]=[];
    private socket;
    private interval;
    private modified:boolean;

    constructor() { 
        this.socket = io(environment.urlServer)
        this.socket.on("connect",()=>{
            this.socket.emit("emmitter");
            this.updateState();
            this.interval = setInterval(()=>{
                this.updateState();
            },5000)
        })
        this.socket.on("disconect",()=>{
            console.log("Server disconected");
            this.interval.unref();
        })

        this.socket.on("messages", (messages)=>{
            this.localState=messages;
            this.modified=false;
        })
    }

    //esto se podría quitar para evitar problemas ya que solo complica todo.
    listenChanges(): Observable<unknown>{
        return new Observable(observable =>{
            this.socket.on("messages",(messages:string[])=>{
                observable.next(messages)
            })
        }).pipe(startWith(this.localState));
    }

    updateState(){
        this.socket.emit("newState", {updated:this.modified, state:this.localState})
        console.log("Estado actualizado")
        this.modified=false;
    }

    addMessage(message:string){
        this.localState.push(message)
        this.modified=true;
    }
    

}







































