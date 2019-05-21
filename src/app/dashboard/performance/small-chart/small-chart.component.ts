import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js';
import { DEFAULT_DOTS_COUNT } from '../performance.constants';

@Component({
  selector: 'sl-small-chart',
  templateUrl: './small-chart.component.html',
  styleUrls: ['./small-chart.component.scss']
})
export class SmallChartComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('canvas') canvas: ElementRef;
  @Input() data: any[];

  chart = {} as any;
  initialDots1 = [];
  initialDots2 = [];
  initialLabels = [];
  intervalLength;
  generalLength;
  labels = [];
  dots1 = [];
  dots2 = [];
  defaultDotsCount = DEFAULT_DOTS_COUNT;
  isView = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.resetData();
    if (this.isData) {
      this.calculateDataForCharts();
    }
  }

  ngAfterViewInit() {
    this.isView = true;
    if (this.labels.length) {
      this.initCharts();
    }
  }

  calculateDataForCharts() {
    this.setInitValues();
    const countedDots = this.defaultDotsCount * this.intervalLength;
    const missedNumber = this.generalLength - countedDots;

    for (let index = 0; index < this.generalLength - missedNumber; index += this.intervalLength) {
      const array1 = this.initialDots1.slice(index, this.intervalLength + index);
      const array2 = this.initialDots2.slice(index, this.intervalLength + index);
      const labels = this.initialLabels.slice(index, this.intervalLength + index);
      this.dots1.push(this.getValue(array1));
      this.dots2.push(this.getValue(array2));
      this.labels.push(this.getLabel(labels));
    }
    this.checkLastInterval(missedNumber);
    if (this.isView) {
      this.setChartData();
    }
  }

  setChartData() {
    this.chart['data'].datasets[0].data = this.dots2;
    this.chart['data'].datasets[1].data = this.dots1;
    this.chart['data'].labels = this.labels;
    this.chart.update();
  }

  checkLastInterval(missedNumber) {
    missedNumber < this.defaultDotsCount / 2 ? this.addToPreviousInterval(missedNumber) : this.addToNewInterval(missedNumber);
  }

  setInitValues() {
    this.initialLabels = this.data.map(item => item[0]);
    this.initialDots1 = this.data.map(item => item[1]);
    this.initialDots2 = this.data.map(item => item[2]);
    this.generalLength = this.initialLabels.length;
    this.intervalLength = Math.round((this.generalLength / this.defaultDotsCount) - 0.5);
  }

  getLabel(array) {
    if (array[0] === array[array.length - 1]) {
      return array[0];
    } else {
      return array[0] + '-' + array[array.length - 1];
    }
  }

  addToPreviousInterval(missedNumber) {
    const array1 = this.initialDots1.slice(this.initialDots1.length - missedNumber - this.intervalLength, this.initialDots1.length);
    this.dots1[this.dots1.length - 1] = this.getValue(array1);
    const array2 = this.initialDots2.slice(this.initialDots2.length - missedNumber - this.intervalLength, this.initialDots2.length);
    this.dots2[this.dots2.length - 1] = this.getValue(array2);
    const labels = this.initialLabels.slice(this.initialLabels.length - missedNumber - this.intervalLength, this.initialLabels.length);
    this.labels[this.labels.length - 1] = this.getLabel(labels);
  }

  addToNewInterval(missedNumber) {
    const array1 = this.initialDots1.slice(this.initialDots1.length - missedNumber, this.initialDots1.length);
    this.dots1.push(this.getValue(array1));
    const array2 = this.initialDots2.slice(this.initialDots2.length - missedNumber, this.initialDots2.length);
    this.dots2.push(this.getValue(array2));
    const labels = this.initialLabels.slice(this.initialLabels.length - missedNumber, this.initialLabels.length);
    this.labels.push(this.getLabel(labels));
  }

  resetData() {
    this.dots1 = [];
    this.dots2 = [];
    this.labels = [];
  }

  getValue(array) {
    const total = array.reduce((sum, value) => (sum += value), 0);
    return total;
  }

  get isData() {
    return this.data && this.data.length;
  }

  initCharts() {
    this.chart = new Chart(this.canvas.nativeElement.getContext('2d'), {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.dots2,
            borderColor: '#ecab54',
            fill: false,
            pointRadius: 4,
            lineTension: 0,
            pointBackgroundColor: 'white',
            drawTicks: true,
          },
          {
            data: this.dots1,
            borderColor: '#716994',
            fill: false,
            pointRadius: 4,
            lineTension: 0,
            pointBackgroundColor: 'white',
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              display: true,
              position: 'top',
              ticks: {
                minRotation: 80,
              },
            }
          ],
          yAxes: [
            {
              display: true,
            },
          ],
        },
        tooltips: {
          callbacks: {
            title: (items, data) => {
              return '';
            },
            label: (tooltipItem, data) => {
              let label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label) {
                label += ': ';
              }
              label += Math.round(tooltipItem.yLabel * 100) / 100;
              return label;
            }
          }
        },
        responsive: true,
        responsiveAnimationDuration: true,
      }
    });
  }

}
