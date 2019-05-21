import { StatusSearchComponent } from './status-search.component';

describe('StatusSearchComponent', () => {

  let component;

  beforeEach(() => {
    component = new StatusSearchComponent();
    component.statuses = component.activeStatuses = [];
  });

  it ('it should set activeStatuses to empty array', () => {
    component.ngOnChanges();
    expect(component.activeStatuses).toEqual([]);
  });

  describe('toggleMenu', () => {

    const eventMock = {
      stopPropagation: function() {}
    };

    beforeEach(() => {
      component.statusMenuIsActive = false;
    });

    it ('should call stopPropagation', () => {
      const stopPropagationSpy = spyOn(eventMock, 'stopPropagation');
      component.toggleMenu(eventMock);
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it ('should set statusMenuIsActive to true', () => {
      component.toggleMenu(eventMock);
      expect(component.statusMenuIsActive).toBeTruthy();
    });
  });

  it ('should assign statusMenuIsActive', () => {
    component.onClickedOutside(true);
    expect(component.statusMenuIsActive).toBeTruthy();
  });

  it ('should set allSelected to true', () => {
    component.allStatusesSelected();
    expect(component.allSelected).toBeTruthy();
  });

  describe('changeStatus', () => {
    let emitSpy;

    beforeEach(() => {
      component.onChangeStatus = {
        emit: function() {}
      };
      emitSpy = spyOn(component.onChangeStatus, 'emit');
    });


    it ('should assign activeStatuses', () => {
      component.changeStatus(1);
      expect(component.activeStatuses).toEqual(1);
    });

  });

});
