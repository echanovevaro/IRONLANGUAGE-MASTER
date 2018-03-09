import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as io from 'socket.io-client';
import * as _ from 'underscore';
import { environment } from '../../environments/environment';

@Injectable()
export class ChatService {
  private url: string = environment.BASE_URL;
  private socket;

  public messages: any[];
  public messageAdded = new Subject();

  constructor() {
  }

  sendMessage(message) {
    this.messages.unshift(message);
    this.socket.emit('sendmessage', message);
    this.messages = _.map(this.messages, (msg) => {
      msg.checked = true;
      return msg;
    });
  }

  updateRoom(message) {
    this.messages.unshift(message);
    this.socket.emit('sendtoroom', message);
    this.messages = _.map(this.messages, (msg) => {
      delete msg['new'];
      return msg;
    });
  }

  joinRoom(meetupId) {
    this.socket.emit('addtoroom', meetupId);
  }

  connect(id, messages) {
    this.messages = _.sortBy(messages, 'created_at').reverse();
    if (!this.socket) {
      this.socket = io(this.url, { query: `id=${id}`});

      this.socket.on('newmessage', (msg) => {
          this.messages.unshift(msg);
          this.messageAdded.next(true);
      });

      this.socket.on('updateroom', (message) => {
          message['new'] = true;
          this.messages.unshift(message);
          this.messageAdded.next(true);
      });
    } else {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket) {
      this.messages = [];
      this.socket.io.disconnect();
    }
  }
}
