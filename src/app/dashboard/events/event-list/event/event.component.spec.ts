import { EventComponent } from './event.component';
import {
  CALENDAR_SERVICE_STUB,
  PERMISSION_SERVICE_STUB
} from '../../../../test/stubs/service-stubs';
import { of } from 'rxjs';

describe('EventComponent', () => {

  let component: EventComponent;
  const calendarService = CALENDAR_SERVICE_STUB;
  const permissionsService = PERMISSION_SERVICE_STUB;
  const route = {} as any;
  const router = {} as any;

  beforeEach(() => {
    component = new EventComponent(
      calendarService,
      permissionsService,
      route,
      router
    );
    component.event = {
      start: '2018-11-07T14:30:00Z'
    };
  });

  afterEach(() => {
    component = null;
  });

  describe('Init data', () => {

    describe('Should set css classes to dots', () => {

      beforeEach(() => {
        component.dotClass = '';
      });

      const dots = [
        { relevance: 10, expectedClass: 'red' },
        { relevance: 50, expectedClass: 'orange' },
        { relevance: 80, expectedClass: 'green' },
      ];

      dots.forEach(dot => {
        it(`should set dots to ${dot.expectedClass} class`, () => {
          component.event.relevance = dot.relevance;
          component.ngOnInit();
          expect(component.dotClass).toBe(dot.expectedClass);
        });
      });

    });

    describe('Should set events date', () => {

      it('should get event date', () => {
        const eventDate = '07/11/18';
        component.event.start = '2018-11-07T14:30:00Z';
        component.ngOnInit();
        expect(component.eventDate).toBe(eventDate);
      });

    });

  });

  describe('Should check events actions', () => {

    beforeEach(() => {
      component.subscriptions = [];
    });

    it('should call evenAction method', () => {
      const event = { isMyEvent: true };
      const eventsActionSpy = spyOn(component, 'eventAction');
      component.eventAction(event);
      expect(eventsActionSpy).toHaveBeenCalledWith(event);
    });

    it('should set canNotAddEvent to false', () => {
        component.canNotAddEvent = true;
        component.closeInfoModal();
        expect(component.canNotAddEvent).toBeFalsy();
      });

    it('should call eventAdded method', () => {
      component.eventAdded = true;
      component.closeAddInfoModal();
      expect(component.eventAdded).toBeFalsy();
    });

    it('should get event distance', () => {
      const distance = 822.2649898822013;
      const result = 0.82;
      const getDistance = component.getDistance(distance);
      expect(getDistance).toBe(result);
    });

    describe('logic for my event', () => {
      const event = { isMyEvent: false };
      const eventObject = {event: {isMyEvent: false}};
      let addEventSpy;

      beforeEach(() => {
        addEventSpy = spyOn(calendarService, 'addEvent').and.returnValue(of(eventObject));
      });

      it ('should call addEvent method', () => {
        component.eventAction(event);
        expect(addEventSpy).toHaveBeenCalled();
      });

      it ('should emit value for emitDisablingButtons', () => {
        const emitDisablingButtonsSpy = spyOn(component.emitDisablingButtons, 'emit');
        component.eventAction(event);
        expect(emitDisablingButtonsSpy).toHaveBeenCalled();
      });

      it ('should set eventAdded to true', () => {
        component.eventAction(event);
        expect(component.eventAdded).toBeTruthy();
      });

      it ('should define component event', () => {
        component.eventAction(event);
        expect(component.event).toBeDefined();
      });

      it ('should set loading to false', () => {
        component.eventAction(event);
        expect(component.loading).toBeFalsy();
      });

      it ('should emit value for onAddEventAction', () => {
        const onAddEventActionSpy = spyOn(component.onAddEventAction, 'emit');
        component.eventAction(event);
        expect(onAddEventActionSpy).toHaveBeenCalled();
      });

      it ('should emit false for emitDisablingButtons', () => {
        const emitDisablingButtonsSpy = spyOn(component.emitDisablingButtons, 'emit');
        component.eventAction(event);
        expect(emitDisablingButtonsSpy).toHaveBeenCalled();
      });
    });

    describe('removeEventFromMyEvents', () => {
      let removeEventSpy;

      beforeEach(() => {
        removeEventSpy = spyOn(calendarService, 'removeEvent').and.returnValue(of({}));
        component.event = {isMyEvent: true};
      });

      it ('should call removeEvent method', () => {
        component.removeEventFromMyEvents();
        expect(removeEventSpy).toHaveBeenCalled();
      });

      it ('should emit event in onRemovingEventAction', () => {
        const onRemovingEventActionSpy = spyOn(component.onRemovingEventAction, 'emit');
        component.removeEventFromMyEvents();
        expect(onRemovingEventActionSpy).toHaveBeenCalled();
      });

      it ('should set isMyEvent to true', () => {
        component.removeEventFromMyEvents();
        expect(component.event.isMyEvent).toBeFalsy();
      });

      it ('should set visibleConfirmWindow to false', () => {
        component.removeEventFromMyEvents();
        expect(component.visibleConfirmWindow).toBeFalsy();
      });

    });

  });

});
