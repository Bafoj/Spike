import {Injectable} from '@angular/core';
import {observable, Observable, Subscriber} from 'rxjs';
import {io} from 'socket.io-client';
import {environment} from '../../environments/environment';
import {startWith} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private socket;
  private interval;
  private additions: string[] = [];

  constructor() {
    this.socket = io(environment.urlServer);
    this.socket.on('connect', () => {
      this.socket.emit('emmitter');
      this.updateState();
      this.interval = setInterval(() => {
        this.updateState();
      }, 5000);
    });
    this.socket.on('disconect', () => {
      console.log('Server disconected');
      this.interval.unref();
    });


  }


  listenChanges(): Observable<string[]> {
    // tslint:disable-next-line:no-shadowed-variable
    return new Observable((observable ) => {
      this.socket.on('messages', (messages: string[]) => {
        if (messages) {
          observable.next(messages);
        } else {
          console.log('vacio');

          observable.next([]);
        }
      });
    });
  }

  updateState(): void{
    this.socket.emit('addMessage', this.additions);
    console.log('Estado actualizado', this.additions);
    this.additions = [];

  }

  addMessage(message: string): void{
    this.additions.push(message);
  }


}
