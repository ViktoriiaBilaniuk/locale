import { DemographicComponent } from './demographic.component';
import { STORE_STUB } from '../../../test/stubs/service-stubs';
import { of } from 'rxjs/index';

describe('DemographicComponent', () => {
  let component: DemographicComponent;
  const store = STORE_STUB;
  const demographicOptions = [
    {value: '1', selected: false},
    {value: '2', selected: false},
  ];
  const resultDemographicOptions = [
    {value: '1', selected: true},
    {value: '2', selected: false},
  ];
  const demographicList = ['1', '2'];
  const data = ['1'];

  beforeEach(() => {
    component = new DemographicComponent(store);
    component.defaultOptions = [];
    component.editMode = false;
    component.data = data;
    component.onEdit = { emit: function() {} } as any;
  });

  it ('should be inited', () => {
    component.ngOnInit();
    expect(component.defaultOptions.length).toBe(0);
  });

  it ('should set edit mode to false', () => {
    component.resetData();
    expect(component.editMode).toBeFalsy();
  });

  it ('should select demographic_options', () => {
    const selectSpy = spyOn(store, 'select').and.returnValue(of(demographicList));
    component.setDefaultOptionsList();
    expect(selectSpy).toHaveBeenCalledTimes(1);
  });

  it ('should set defaultOptions', () => {
    spyOn(store, 'select').and.returnValue(of(demographicList));
    component.setDefaultOptionsList();
    expect(component.defaultOptions).toEqual(demographicOptions);
  });

  it ('should change edit mode to true', () => {
    component.pencilClick();
    expect(component.editMode).toBeTruthy();
  });

  it ('should change default options if it is present in data array', () => {
    component.defaultOptions = demographicOptions;
    component.populateSelection();
    expect(component.defaultOptions).toEqual(resultDemographicOptions);
  });

  it ('should set edit mode to false in editDemographic', () => {
    component.editMode = true;
    component.editDemographic(data);
    expect(component.editMode).toBeFalsy();
  });

  it ('should emit value', () => {
    component.editMode = true;
    const newValue = ['1', '2'];
    const onEditSpy = spyOn(component.onEdit, 'emit');
    component.editDemographic(newValue);
    expect(onEditSpy).toHaveBeenCalledTimes(1);
  });

  describe('reset data', () => {
    let spyOnResetData;
    beforeEach(() => {
      spyOnResetData = spyOn(component, 'resetData');
    });

    it('should call resetData from ngOnChanges', () => {
      component.ngOnChanges();
      expect(spyOnResetData).toHaveBeenCalled();
    });

    it('should call resetData from onCancelClick', () => {
      component.onCancelClick();
      expect(spyOnResetData).toHaveBeenCalled();
    });
  });

  it('should call editDemographic with new value', () => {
    component.defaultOptions = resultDemographicOptions;
    const editSpy = spyOn(component, 'editDemographic');
    component.onSaveClick();
    expect(editSpy).toHaveBeenCalledWith(data);
  });


});
