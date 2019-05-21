import { ReachChartComponent } from './reach-chart.component';

describe('ReachChartComponent', () => {

  let component;

  beforeEach(() => {
    component = new ReachChartComponent();
    component.paidPercent = 10;
    component.organicPercent = 90;
  });

  it ('should init organicPercent', () => {
    component.organicPercent = undefined;
    component.ngOnChanges();
    expect(component.organicPercent).toEqual(90);
  });

  it ('should return paidWidth', () => {
    expect(component.paidWidth).toEqual('10%');
  });

  it ('should return organicRadius', () => {
    expect(component.organicRadius).toEqual('0px 5px 5px 0px');
  });

  it ('should return paidRadius', () => {
    expect(component.paidRadius).toEqual('5px 0px 0px 5px');
  });

  it ('should return organicWidth', () => {
    expect(component.organicWidth).toEqual('90%');
  });

  it ('should return paidMinWidth', () => {
    expect(component.paidMinWidth).toEqual('25px');
  });

  it ('should return organicMinWidth', () => {
    expect(component.organicMinWidth).toEqual('25px');
  });

  it ('should return paidStyle', () => {
    expect(component.paidStyle).toEqual({
      'width': '10%',
      'min-width': '25px',
      'border-radius': '5px 0px 0px 5px'
    });
  });

  it ('should return organicStyle', () => {
    expect(component.organicStyle).toEqual({
      'width': '90%',
      'min-width': '25px',
      'border-radius': '0px 5px 5px 0px'
    });
  });

});
