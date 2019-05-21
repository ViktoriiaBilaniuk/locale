import { Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, ViewChildren} from '@angular/core';

@Component({
  selector: 'sl-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss'],
})
export class ThreadsComponent implements OnInit, OnChanges {

  @Input() thread: any;
  @Input() chatPermissionForCurrentVenue: any;
  @Output() onSelectVenue = new EventEmitter();
  @ViewChildren('message') messages: QueryList<any>;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if (changes.thread) {
      this.thread.venues.forEach(venue => venue['open'] = false );
    }
  }

  get isReachOut() {
    return this.thread.title === 'Leftbar.reachOut';
  }

  chooseVenue(venue, event) {
    event.stopPropagation();
    this.onSelectVenue.emit(venue);
  }

  expandMess(event, venue) {
    event.stopPropagation();
    venue.open = !venue.open;
  }

}
