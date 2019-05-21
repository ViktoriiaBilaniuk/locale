import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Store } from '../../../core/store/store';
import { EXPAND } from '../../header/expand-chat/expand-constants';
import { filter } from 'rxjs/operators';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe';
import * as moment from 'moment';
import { NETWORKS } from '../publication/publication.constants';

@AutoUnsubscribe
@Component({
  selector: 'sl-monthly-view',
  templateUrl: './monthly-view.component.html',
  styleUrls: ['./monthly-view.component.scss']
})
export class MonthlyViewComponent implements OnInit, OnChanges {
  @Input() posts;
  @Input() from;
  @Input() allChannelsAreDissconnected;
  @Input() channelsExists;
  @Input() postManagementPermission;
  @Output() onDateClick = new EventEmitter();
  @Output() createClicked = new EventEmitter();
  storeSubscription$;
  expandStatus;
  postsByDay = {};

  constructor(private store: Store) {}

  ngOnInit() {
    this.subscribeOnExpandStatus();
  }

  ngOnChanges() {
    if (this.posts && this.from) {
      this.fillPosts();
    }
  }

  viewDate() {
    if (!this.from) {
      return new Date();
    }
    return this.from.clone().add('10', 'day');
  }

  fillPosts() {
    const day = moment(this.from).startOf('month');
    const lastDay = moment(this.from).endOf('month');
    while (day.valueOf() < lastDay.valueOf()) {
      this.postsByDay[this.formatedDate(day)] = this.getPostsCountsByNetwork(day);
      day.add(1, 'day');
    }
  }

  getPostsCountsByNetwork(day) {
    const postsForDay = this.posts.filter(post => this.formatedDate(post.date) === this.formatedDate(day));
    const counts = {};
    Object.keys(NETWORKS).forEach(key => {
      key = key.toLowerCase();
      counts[key] = this.filterByNetwork(postsForDay, key);
    });
    return counts;
  }

  filterByNetwork(posts, key) {
    return posts.filter(post => post.network === key).length;
  }

  subscribeOnExpandStatus() {
    this.storeSubscription$ = this.store.select(EXPAND)
      .pipe(
        filter((res: any) => res)
      )
      .subscribe((expandStatus) => {
        this.expandStatus = expandStatus;
      });
  }

  getPostsForCurrentDay(date) {
    return this.postsByDay[this.formatedDate(date)] || {};
  }

  formatedDate(date) {
    return moment(date).format('YYYY-MM-DD');
  }

}
