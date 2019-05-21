import { ObjectiveComponent } from './objective.component';

describe('MenusComponent', () => {
  let component: ObjectiveComponent;
  const optionMock = '1';

  beforeEach(() => {
    component = new ObjectiveComponent();
    component.onEdit = {
      emit: function(value) { return value; },
    } as any ;
  });

  it ('should set edit mode to false', () => {
    component.ngOnChanges();
    expect(component.editMode).toBeFalsy();
  });

  it ('should emit value', () => {
    const onEditSpy = spyOn(component.onEdit, 'emit');
    component.onChangeOption(optionMock);
    expect(onEditSpy).toHaveBeenCalledWith(optionMock);
  });

  it ('should set edit mode to false in onChangeOption', () => {
    component.onChangeOption(optionMock);
    expect(component.editMode).toBeFalsy();
  });

});
