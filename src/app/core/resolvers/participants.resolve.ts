import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ChatService } from '../services/chat/chat.service';

@Injectable()
export class ParticipantsResolve implements Resolve<any> {
  constructor( private chatService: ChatService) {}

  resolve() {
    this.chatService.participants
      .subscribe(res => res);
    return false;
  }
}
