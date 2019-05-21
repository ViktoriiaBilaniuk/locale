import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '../../../../core/store/store';
import { filter } from 'rxjs/internal/operators';
import { EXPAND, EXPAND_STATUS } from '../../../header/expand-chat/expand-constants';

@Component({
  selector: 'sl-chat-toast',
  templateUrl: './chat-toast.component.html',
  styleUrls: ['./chat-toast.component.scss']
})
export class ChatToastComponent implements OnInit {
  expand;
  @Input() text: string;
  @Input() index;
  @Input() contentPoolPage;
  @Output() cancel = new EventEmitter();
  storeSubscription$;

  constructor( private store: Store ) { }

  ngOnInit() {
    this.subscribeOnExpandStatus();
  }

  subscribeOnExpandStatus() {
    this.storeSubscription$ = this.store.select(EXPAND)
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(status => {
        this.expand = status === EXPAND_STATUS.EXPANDED;
      });
  }

  getPosition() {
    return this.contentPoolPage ? (-40 + this.index * 43 + 'px') : (-60 - this.index * 43 + 'px');
  }

}
