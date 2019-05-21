import { ThreadsComponent } from './threads.component';

describe('ThreadsComponent', () => {

  let component;
  const threadMock = {
    venues: [{open: true}, {open: true}],
    title: 'Leftbar.reachOut'
  };

  beforeEach(() => {
    component = new ThreadsComponent();
    component.thread = threadMock;
  });

  it('should set open to false for each venue', () => {
    component.ngOnChanges({thread: true});
    threadMock.venues.forEach(item => {
      expect(item.open).toBeFalsy();
    });
  });

  it ('should return true', () => {
    expect(component.isReachOut).toBeTruthy();
  });

  describe('chooseVenue', () => {

    const event = {
      stopPropagation: function () {}
    };
    let stopPropagationSpy;

    beforeEach(() => {
      stopPropagationSpy = spyOn(event, 'stopPropagation');
      component.onSelectVenue = {emit: function() {}};
    });

    it('should call stopPropagation', () => {
      component.chooseVenue(1, event);
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should emit value', () => {
      const emitSpy = spyOn(component.onSelectVenue, 'emit');
      component.chooseVenue(1, event);
      expect(emitSpy).toHaveBeenCalled();
    });
  });

});
