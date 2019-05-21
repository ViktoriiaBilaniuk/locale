import { SmallChartComponent } from './small-chart.component';
import { CHART_DATA } from '../../../test/mocks/performance-mocks';

describe('SmallChartComponent', () => {
  let component;
  let setChartDataSpy;
  const chartMock = {
    data: {
      datasets: [
        { data: [] },
        { data: [] },
      ]
    }
  };

  const canvasMock = {
    nativeElement: {
      getContext: function() { return []; } as any,
    } as any
  } as any;

  beforeEach(() => {
    component = new SmallChartComponent();
    component.defaultDotsCount = 7;
    component.intervalLength = 2;
    component.chart = chartMock;
    setChartDataSpy = spyOn(component, 'setChartData');
  });

  describe('ngAfterViewInit', () => {

    let initChartsSpy;

    beforeEach(() => {
      component.labels = ['1'];
      initChartsSpy = spyOn(component, 'initCharts');
    });

    it('should set isView to true',  () => {
      component.ngAfterViewInit();
      expect(component.isView).toBeTruthy();
    });

    it('should call initCharts',  () => {
      component.ngAfterViewInit();
      expect(initChartsSpy).toHaveBeenCalled();
    });

  });

  describe('calculateDataForCharts', () => {

    beforeEach(() => {
      component.data = CHART_DATA;
    });

    it('should set dots1',  () => {
      component.calculateDataForCharts();
      expect(component.dots1.length).toBeGreaterThan(0);
    });

    it('should set dots2',  () => {
      component.calculateDataForCharts();
      expect(component.dots2.length).toBeGreaterThan(0);
    });

    it('should set labels',  () => {
      component.calculateDataForCharts();
      expect(component.labels.length).toBeGreaterThan(0);
    });

    it('should call setChartData method',  () => {
      component.isView = true;
      component.calculateDataForCharts();
      expect(setChartDataSpy).toHaveBeenCalled();
    });
  });

  describe('checkLastInterval', () => {

    beforeEach(() => {
      component.data = CHART_DATA;
    });

    it('addToPreviousInterval should be called',  () => {
      const addToPreviousIntervalSpy = spyOn(component, 'addToPreviousInterval');
      component.checkLastInterval(1);
      expect(addToPreviousIntervalSpy).toHaveBeenCalled();
    });

    it('addToNewInterval should be called',  () => {
      const addToNewIntervalSpy = spyOn(component, 'addToNewInterval');
      component.checkLastInterval(4);
      expect(addToNewIntervalSpy).toHaveBeenCalled();
    });

  });

  describe('setInitValues', () => {

    beforeEach(() => {
      component.data = CHART_DATA;
    });

    it('should set initialLabels',  () => {
      component.setInitValues();
      expect(component.initialLabels.length).toBeGreaterThan(0);
    });

    it('should set initialDots1',  () => {
      component.setInitValues();
      expect(component.initialDots1.length).toBeGreaterThan(0);
    });

    it('should set initialDots2',  () => {
      component.setInitValues();
      expect(component.initialDots2.length).toBeGreaterThan(0);
    });

    it('should set generalLength',  () => {
      component.setInitValues();
      expect(component.generalLength).toEqual(7);
    });

    it('should set intervalLength',  () => {
      component.generalLength = 5;
      component.defaultDotsCount = 2;
      component.setInitValues();
      expect(component.intervalLength).toEqual(3);
    });

  });

  it ('should reset data', () => {
    component.dots1 = component.dots2 = component.labels = ['1'];
    component.resetData();
    expect(component.dots1).toEqual([]);
    expect(component.dots2).toEqual([]);
    expect(component.labels).toEqual([]);
  });

  it ('should return total value', () => {
    const array = [1, 2, 3];
    expect(component.getValue(array)).toEqual(6);
  });

  it ('should return true', () => {
    component.data = ['1'];
    expect(component.isData).toBeTruthy();
  });

  describe('addToNewInterval', () => {
    const array = [0, 1];
    let initLength, resultLength;

    beforeEach(() => {
      initLength = component.dots1.length;
      resultLength = initLength + 1;
      component.initialDots1 = array;
      component.initialDots2 = array;
      component.initialLabels = array;
      component.labels = [];
    });

    it ('should add new dots1 element', () => {
      component.addToNewInterval(1);
      expect(component.dots1.length).toEqual(resultLength);
    });

    it ('should add new dots2 element', () => {
      component.addToNewInterval(1);
      expect(component.dots2.length).toEqual(resultLength);
    });

    it ('should add new labels element', () => {
      component.addToNewInterval(1);
      expect(component.labels.length).toEqual(resultLength);
    });
  });

/*  it ('should init charts', () => {
    component.data = CHART_DATA;
    component.canvas = canvasMock;
    component.initCharts();
    expect(component.chart).toBeDefined();
  });*/

});
