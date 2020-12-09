import {Injectable} from '@angular/core';
import {observable, Observable} from 'rxjs';
import {io, Socket} from 'socket.io-client';
import { startWith } from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private socket:Socket;

  messages:string[];
  constructor() {
    this.socket = io(environment.urlServer);

    this.socket.on('messages', (messages: string[]) => {
      this.messages = messages
    });

    this.socket.on('disconect', () => {
      console.log('Server disconected');

    });
  }

  
  listenChanges(): Observable<string[]>{
    return new Observable(sus => {
      this.socket.on('messages', (messages: string[]) => {
        sus.next(messages);
      });
    });
  }

}
