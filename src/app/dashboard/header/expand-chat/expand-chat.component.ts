import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '../../../core/store/store';
import { EXPAND, EXPAND_STATUS } from './expand-constants';
import { filter } from 'rxjs/operators';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe';
import { ChatService } from '../../../core/services/chat/chat.service';

@AutoUnsubscribe
@Component({
  selector: 'sl-expand-chat',
  templateUrl: './expand-chat.component.html',
  styleUrls: ['./expand-chat.component.scss']
})
export class ExpandChatComponent implements OnInit {
  @Output() onExpand = new EventEmitter();
  allowExpand = true;
  status = EXPAND_STATUS.OPEN;
  storeSubscription$;
  subscriptions = [];

  constructor(private store: Store, private chatService: ChatService) {
  }

  ngOnInit() {
    this.checkResponsive();
    this.subscribeOnExpandStatus();
  }

  get unreadMessCount() {
    return this.chatService.unreadMessCount;
  }

  checkResponsive() {
    this.allowExpand = window.innerWidth >= 1400;
  }

  subscribeOnExpandStatus() {
    this.storeSubscription$ = this.store.select(EXPAND)
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(status => {
        this.status = status;
      });
  }

  expandChatClick() {
    if (this.canNotExpandChat()) {
      return;
    }
    switch (this.status) {
      case EXPAND_STATUS.OPEN: this.expandChat(); break;
      case EXPAND_STATUS.CLOSED: this.openChat(); break;
      case EXPAND_STATUS.EXPANDED: this.openChat(); break;
    }
  }

  canNotExpandChat() {
    return !this.allowExpand && this.status !== EXPAND_STATUS.CLOSED;
  }

  expandChat() {
    this.store.set(EXPAND, EXPAND_STATUS.EXPANDED );
  }

  openChat() {
    this.store.set(EXPAND, EXPAND_STATUS.OPEN );
  }

  closeChat() {
    this.store.set(EXPAND, EXPAND_STATUS.CLOSED );
  }

  getTitle() {
    if (this.canNotExpandChat()) {
      return 'Expand.chat';
    }
    switch (this.status) {
      case EXPAND_STATUS.OPEN: return 'Expand.expandChat';
      case EXPAND_STATUS.CLOSED: return 'Expand.openChat';
      case EXPAND_STATUS.EXPANDED: return 'Expand.collapseChat';
    }
  }

  isExpandedState() {
    return this.status === EXPAND_STATUS.EXPANDED;
  }

  isClosedState() {
    return this.status === EXPAND_STATUS.CLOSED;
  }
}
