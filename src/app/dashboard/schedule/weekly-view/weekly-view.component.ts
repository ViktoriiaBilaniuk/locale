import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { EXPAND } from '../../header/expand-chat/expand-constants';
import { filter } from 'rxjs/operators';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe';
import { Store } from '../../../core/store/store';

@AutoUnsubscribe
@Component({
  selector: 'sl-weekly-view',
  templateUrl: './weekly-view.component.html',
  styleUrls: ['./weekly-view.component.scss']
})
export class WeeklyViewComponent implements OnChanges, OnInit {
  @Input() posts;
  @Input() from;
  @Input() postManagementPermission;
  @Input() allChannelsAreDissconnected;
  @Input() channelsExists;
  @Input() navigateToTodayOnWeekly;
  @Input() navigateToDay;
  @Output() onCreatePost = new EventEmitter();
  @Output() onEdit = new EventEmitter();
  @Output() onCopy = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  @ViewChild('weeklyContainer') weeklyContainer;
  days = [];
  storeSubscription$;
  expandStatus;

  constructor(private store: Store) {}

  ngOnInit() {
    this.subscribeOnExpandStatus();
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

  ngOnChanges() {
    if (this.from) {
      this.fillDays();
      this.fillPosts();
    }
    if (this.navigateToTodayOnWeekly && this.posts && this.weeklyContainer && this.weeklyContainer.nativeElement && this.days) {
      const today = this.formatedDate(moment());
      this.scrollToToday(this.findDate(today));
    }
    if (this.navigateToDay && this.posts && this.weeklyContainer && this.weeklyContainer.nativeElement) {
      const date = this.formatedDate(moment(this.navigateToDay));
      this.scrollToToday(date);
    }
  }

  scrollToToday(day) {
    setTimeout(() => {
      const todayElement = document.getElementById(day);
      if (todayElement) {
        todayElement.scrollIntoView();
      }
    }, 0);
  }

  findDate(date) {
    const day = this.days.find(item => item.date === date);
    if (day) {
      return day.date;
    }
  }

  fillDays() {
    const fromDate = this.from.clone();
    let index = 0;
    while (index !== 7) {
      this.days[index] = {date: this.formatedDate(fromDate), posts: []};
      index++;
      fromDate.add(1, 'day');
    }
  }

  fillPosts() {
    this.days.forEach((day) => {
      this.posts.forEach((post) => {
        if (this.formatedDate(post.date) === day.date) {
          day.posts.push(post);
        }
      });
    });
  }

  formatedDate(date) {
    return moment(date).format('YYYY-MM-DD');
  }
}
