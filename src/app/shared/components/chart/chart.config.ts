import { BORDER_COLORS } from './border-colors.constants';

const datasets = BORDER_COLORS.map((borderColor) => {
  return {
    borderColor,
    lineTension: 0,
    borderWidth: 4,
    fill: false,
    drawTicks: true,
    pointRadius: 2,
    pointHoverRadius: 2,
  };
});

export const CHART_CONFIG = {
  type: 'line',
  data: {
    datasets
  },
  options: {
    elements: {
      point: {
        radius: 0
      }
    },
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          display: true,
          position: 'top',
        },
      ],
      yAxes: [
        {
          display: true,
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
    responsiveAnimationDuration: true
  }
};
