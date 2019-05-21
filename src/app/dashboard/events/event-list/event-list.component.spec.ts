import { EventListComponent } from './event-list.component';

describe('EventListComponent', () => {

  let component: EventListComponent;

  beforeEach(() => {
    component = new EventListComponent();
  });

  afterEach(() => {
    component = null;
  });

  describe('Init data', () => {

    it('should set events', () => {
      component.myEvents = {today: [{
        category: 'concerts',
        description: 'GRIDRUNNER',
        distance: 334.8740619717658,
        duration: 0,
        end: new Date('2018-11-08T20:00:00.000Z'),
        external_id: 'adrkntkheTEyh6bsVz',
        id: '5bd97a57bba6e7793817040a',
        isMyEvent: true,
        local_rank: 52,
        rank: 41,
        relevance: 52,
        scope: 'locality',
        start: new Date('2018-11-08T20:00:00.000Z'),
        timezone: 'Europe/Dublin',
        title: 'GRIDRUNNER',
        venue_id: '5bd3300683d86a3d179080fa'
      }]};

      const myEvents = {today: [{
        category: 'concerts',
        description: 'GRIDRUNNER',
        distance: 334.8740619717658,
        duration: 0,
        end: new Date('2018-11-08T20:00:00.000Z'),
        external_id: 'adrkntkheTEyh6bsVz',
        id: '5bd97a57bba6e7793817040a',
        isMyEvent: true,
        local_rank: 52,
        rank: 41,
        relevance: 52,
        scope: 'locality',
        start: new Date('2018-11-08T20:00:00.000Z'),
        timezone: 'Europe/Dublin',
        title: 'GRIDRUNNER',
        venue_id: '5bd3300683d86a3d179080fa'
      }]};
      component.ngOnInit();
      expect(component.events).toEqual(myEvents);
    });

  });

  describe('check is it todays events', () => {

    it ('hasTodaysEvents should return true', () => {
      component.events = {};
      component.events.today = true;
      expect(component.hasTodaysEvents).toBeTruthy();
    });

    it ('hasTodaysEvents should return false', () => {
      component.events = {};
      component.events.today = false;
      expect(component.hasTodaysEvents).toBeFalsy();
    });

    it ('hasTomorrowsEvents should return true', () => {
      component.events = {};
      component.events.tomorrow = true;
      expect(component.hasTomorrowsEvents).toBeTruthy();
    });

    it ('hasTomorrowsEvents should return false', () => {
      component.events = {};
      component.events.tomorrow = false;
      expect(component.hasTomorrowsEvents).toBeFalsy();
    });

    it ('noTodaysEvents should return true', () => {
      component.events = {};
      component.events.today = [];
      expect(component.noTodaysEvents).toBeTruthy();
    });

    it ('noTodaysEvents should return false', () => {
      component.events = {};
      component.events.today = [{
        category: 'concerts',
        description: 'GRIDRUNNER',
        distance: 334.8740619717658,
      }];
      expect(component.noTodaysEvents).toBeFalsy();
    });

    it ('noTomorrowsEvents should return true', () => {
      component.events = {};
      component.events.tomorrow = [];
      expect(component.noTomorrowsEvents).toBeTruthy();
    });

    it ('noTomorrowsEvents should return false', () => {
      component.events = {};
      component.events.tomorrow = [{
        category: 'concerts',
        description: 'GRIDRUNNER',
        distance: 334.8740619717658,
      }];
      expect(component.noTomorrowsEvents).toBeFalsy();
    });

  });

  describe('should check adding and removing buttons events', () => {

    it('should emit onAddEvent', () => {
      const event = {
        distance: 459.8396701052386,
        duration: 11700,
        timezone: 'Europe/Dublin',
        title: 'Improv - Level 2'
      };
      const addEventSpy = spyOn(component, 'onAddEvent');
      component.onAddEventAction(event);
      component.onAddEvent.subscribe(() => {
        expect(addEventSpy).toHaveBeenCalledWith(event);
      });
    });

    it('should emit onRemovingEvent', () => {
      const event = {
        distance: 459.8396701052386,
        duration: 11700,
        timezone: 'Europe/Dublin',
        title: 'Improv - Level 2'
      };
      const removeEventSpy = spyOn(component, 'onRemovingEvent');
      component.onRemovingEventAction(event);
      component.onRemovingEvent.subscribe(() => {
        expect(removeEventSpy).toHaveBeenCalledWith(event);
      });
    });

    it('should disable add buttons', () => {
      const isDisabled = true;
      component.disabledButtons = false;
      component.onDisabledButtons(isDisabled);
      expect(component.disabledButtons).toBeTruthy();
    });

    it('should enable add buttons', () => {
      const notDisabled = false;
      component.disabledButtons = true;
      component.onDisabledButtons(notDisabled);
      expect(component.disabledButtons).toBeFalsy();
    });

  });

});
