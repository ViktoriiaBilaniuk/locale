import { TargetMarketComponent } from './target-market.component';
import { STORE_STUB } from '../../../test/stubs/service-stubs';
import {
  FORMED_OBJECT_TARGET_MARKET, FORMED_TARGET_MARKET_DATA, TARGET_MARKET_DATA,
  TARGET_MARKET_ITEM
} from '../../../test/mocks/details-mocks';
import { of } from 'rxjs/index';

describe('TargetMarketComponent', () => {
  let component: TargetMarketComponent;
  const store = STORE_STUB;
  const emptyArray = [];
  const formedTargetMarketData = FORMED_TARGET_MARKET_DATA;
  const item = TARGET_MARKET_ITEM;
  const formedObject = FORMED_OBJECT_TARGET_MARKET;
  const initTitle = 'some_title';
  const resultTitle = 'Some title';
  const newVale = [{value: 'title', title: 'Title'}];
  const items = ['1', '2', '3'];

  beforeEach(() => {
    component = new TargetMarketComponent(store);
    component.editMode = true;
    component.defaultOptions = undefined;
    component.venueOptions = undefined;
    component.data = TARGET_MARKET_DATA;
    component.onEdit = { emit: function() {}} as any;
    component.newVenueOptions = [];
  });

  it('should set editMode to false in ngOnChanges', () => {
    component.ngOnChanges();
    expect(component.editMode).toBeFalsy();
  });

  it('should set editMode to false in resetData', () => {
    component.resetData();
    expect(component.editMode).toBeFalsy();
  });

  it('should assign defaultOptions to empty array in resetData', () => {
    component.resetData();
    expect(component.defaultOptions).toEqual(emptyArray);
  });

  it('should assign venueOptions to empty array in resetData', () => {
    component.resetData();
    expect(component.venueOptions).toEqual(emptyArray);
  });

  it('should set venueOptions', () => {
    component.setVenueOptions();
    expect(component.venueOptions).toEqual(formedTargetMarketData);
  });

  it('should set editMode to false in pencilClick', () => {
    component.pencilClick();
    expect(component.editMode).toBeFalsy();
  });

  it('should return formed object', () => {
    expect(component.formObject(item)).toEqual(formedObject);
  });

  it('should return title', () => {
    expect(component.getTitle(initTitle)).toBe(resultTitle);
  });

  it('should emit value', () => {
    const emitSpy = spyOn(component.onEdit, 'emit');
    component.editTargetMarket(newVale);
    expect(emitSpy).toHaveBeenCalledWith(newVale);
  });

  it('should set editMode to false in editTargetMarket', () => {
    component.editTargetMarket(newVale);
    expect(component.editMode).toBeFalsy();
  });

  it('should set editMode to false in onCancelClick', () => {
    component.onCancelClick();
    expect(component.editMode).toBeFalsy();
  });

  it('should set newVenueOptions', () => {
    component.onAddItem(items);
    expect(component.newVenueOptions).toEqual(items);
  });

  describe('setDefaultOptionsList', () => {
    const val = 'value' as any;
    const stream = of([val]);
    let storeSelectSpy;
    beforeEach(() => {
      storeSelectSpy = spyOn(store, 'select').and.returnValue(stream);
      component.defaultOptions = undefined;
    });

    it('should select value', () => {
      component.setDefaultOptionsList();
      expect(storeSelectSpy).toHaveBeenCalled();
    });

    it('should assign defaultOptions', () => {
      component.setDefaultOptionsList();
      expect(component.defaultOptions).toBeDefined();
    });

  });
});
