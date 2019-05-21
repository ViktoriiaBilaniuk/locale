import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import Chart from 'chart.js';
import { ReplaySubject ,  Subscription } from 'rxjs';
import { EXPAND } from '../../../dashboard/header/expand-chat/expand-constants';
import { filter } from 'rxjs/operators';
import { Store } from '../../../core/store/store';

@Component({
  selector: 'sl-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges, OnDestroy {
  @Input() chartSource;
  @Input() chartConfig;
  @Input() tableSource: ReplaySubject<any>;
  @Output() isChartVisible = new EventEmitter<boolean>();
  @ViewChild('canvas') canvas: ElementRef;

  chart = {} as any;
  tableSub: Subscription;
  isChart: boolean;
  storeSubscription$;
  expandStatus;

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store) {
    this.subscribeOnExpandStatus();
  }

  subscribeOnExpandStatus() {
    this.storeSubscription$ = this.store.select(EXPAND)
      .pipe(
        filter((res: any) => res)
      )
      .subscribe((expandStatus) => {
        this.expandStatus = expandStatus;
        this.drawChart();
      });
  }

  ngOnChanges() {
    this.cd.detectChanges();
    this.drawChart();
  }

  drawChart() {
    this.clearTableSub();
    if (this.isDataForChart()) {
      this.initChart();
      this.setChartData();
    }
  }

  isDataForChart() {
    return this.chartConfig && this.tableSource && this.canvas;
  }

  initChart() {
    if (this.chart && this.chart.chart) {
      this.chart.destroy();
    }
    const ctx = this.canvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, this.chartConfig);
  }

  setChartData() {
    this.tableSub = this.tableSource
      .subscribe(data => {
        if (data) {
          this.checkChartAvailability(data);
          this.chartSource.forEach((metric, index) => {
            // this.chart['data'].datasets[index].data = data[index].selected ? metric : '';
            this.chart['data'].datasets[index].data =  data[index].selected ?
              this.getChartData(metric, this.getSelectedChartSource(data, index)) : '';
          });
          this.chart.update();
          setTimeout(() => {
            this.chart.update();
          }, 5000);
        }
      });
  }

  getSelectedChartSource(tableSource, index) {
    return this.chartSource.slice(0, index).filter((source, i) => tableSource[i].selected);
  }

  getChartData(metric, data) {
    if (!data.length) {
      return metric;
    }
    return metric.map(((value, index) => {
      return this.calculateValue(data, value, index);
    }));
  }

  calculateValue(data, value, index) {
    let newValue = value;
    data.forEach((dataArray) => {
      newValue += dataArray[index];
    });
    return Math.round(newValue * 1000) / 1000;
  }


  checkChartAvailability(data) {
    this.isChart = data.every((item) => !item.selected);
    this.isChartVisible.emit(this.isChart);
  }

  clearTableSub() {
    if (this.tableSub) {
      this.tableSub.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.clearTableSub();
    if (this.storeSubscription$) {
      this.storeSubscription$.unsubscribe();
    }
  }
}
