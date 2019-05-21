import {OpeningHoursComponent} from './opening-hours.component';
import {
  OPENING_HOURS_EDITOR, OPENING_HOURS_EDITOR_RESULT, TIME_EDITOR, TIMETABLE_MOCK,
  WEEKDAY_MOCK
} from '../../../test/mocks/details-mocks';
import moment = require('moment');

describe('MenusComponent', () => {
  let component: OpeningHoursComponent;
  const timeEditorMock = TIME_EDITOR;
  const weekdayMock = WEEKDAY_MOCK;
  const openingHoursEditor = OPENING_HOURS_EDITOR;
  const openingHoursEditorResult = OPENING_HOURS_EDITOR_RESULT;
  const itemMock = {values: ['1', '2']};
  const openingHoursItem = {
    fromMoment: moment(new Date()),
    from: undefined,
    toMoment: moment(new Date()),
    to: moment(new Date()).valueOf(),
    fromLabel: '',
    toLabel: '',
    values: [],
  };
  let onEditSpy;
  const initLength = weekdayMock.items.length;
  const timetable = TIMETABLE_MOCK;
  const changesMock = {
    timetable: {
      currentValue: true,
    },
  };

  beforeEach(() => {
    component = new OpeningHoursComponent();
    component.timeEditor = timeEditorMock as any;
    component.editableHours = [];
    component.timetable = timetable as any;
    onEditSpy = spyOn(component.onEdit, 'emit');
  });

  it('should call onCancelClick', () => {
    const onCancelClickSpy = spyOn(component, 'onCancelClick');
    component.ngOnChanges(changesMock);
    expect(onCancelClickSpy).toHaveBeenCalled();
  });

  it ('should change timeEditor', () => {
    component.toggleSliderMode(weekdayMock, itemMock, null);
    expect(component.timeEditor).toEqual(openingHoursEditorResult as any);
  });

  it ('should assign editableHours', () => {
    component.toggleSliderMode(weekdayMock, itemMock, null);
    expect(component.editableHours).toEqual(itemMock.values);
  });

  it ('should set edit mode to false', () => {
    component.onSaveClick();
    expect(component.editMode).toBeFalsy();
  });

  it ('should emit value', () => {
    component.onSaveClick();
    expect(onEditSpy).toHaveBeenCalled();
  });

  it ('should not change time', () => {
    const item = undefined;
    component.changeTime(item, null);
    expect(item).toEqual(item);
  });

  it ('should set edit mode to false on cancel', () => {
    component.onCancelClick();
    expect(component.editMode).toBeFalsy();
  });

  it ('should map timeEditor', () => {
    component.onCancelClick();
    expect(component.timeEditor).not.toEqual(timeEditorMock as any);
  });

  it ('should add empty item', () => {
    component.addTimeEntry(weekdayMock);
    expect(weekdayMock.items.length).toEqual(initLength + 1);
  });

  it ('should remove item', () => {
    const initEditorLength = openingHoursEditor.items.length;
    component.removeTimeEntry(openingHoursEditor as any, 0);
    expect(openingHoursEditor.items.length).toEqual(initEditorLength - 1);
  });

});
