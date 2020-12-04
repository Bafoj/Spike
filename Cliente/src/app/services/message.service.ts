import {Injectable} from '@angular/core';
import {observable, Observable} from 'rxjs';
import {io} from 'socket.io-client';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private socket;

  constructor() {
    this.socket = io(environment.urlServer);

    this.socket.on('disconect', () => {
      console.log('Server disconected');

    });
  }

  listenChanges(): Observable<string[]> {
    return new Observable(observable => {
      this.socket.on('messages', (messages: string[]) => {
        observable.next(messages);
      });
    });
  }

}
