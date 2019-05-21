import { MessageComponent } from './message.component';
import * as moment from 'moment';
import { TrackingSerivce } from '../../../core/services/tracking/tracking.service';

describe('MessageComponent', () => {

  let component: MessageComponent;

  beforeEach(() => {
    component = new MessageComponent(new TrackingSerivce ());
  });

  describe('header', () => {
    it('should show header if there is no previous message', () => {
      component.message = {
      };
      component.ngOnInit();
      expect(component.showHeader).toBeTruthy();
    });

    it('should show header if previous message has different author', () => {
      component.message = {
        _user: 'test'
      };
      component.previousMessage = {
        _user: 'test2'
      };
      component.ngOnInit();
      expect(component.showHeader).toBeTruthy();
    });

    it('should show header if previous message was sent more than 1 minute ago', () => {
      component.message = {
        _user: 'test',
        time: 1516837995845
      };
      component.previousMessage = {
        _user: 'test',
        time: 1516836994845
      };
      component.ngOnInit();
      expect(component.showHeader).toBeTruthy();
    });

    it('should not show header if previous message was sent less than 1 minute ago', () => {
      component.message = {
        _user: 'test',
        time: 1516837995845
      };
      component.previousMessage = {
        _user: 'test',
        time: 1516837994845
      };
      component.ngOnInit();
      expect(component.showHeader).toBeFalsy();
    });
  });
  it('should indicate if message contains url', () => {
    component.message = {
      content: {
        text: 'http://www.test.com'
      }
    };

    expect(component.isUrl).toBeTruthy();
  });

  it('should indicate if message does not contain url', () => {
    component.message = {
      content: {
        text: 'some text'
      }
    };

    expect(component.isUrl).toBeFalsy();
  });

  it('should format today`s message date', () => {
    const date = moment();
    component.message = {
      time: date
    };

    expect(component.formattedDate).toBe(date.format('HH:mm'));
  });

  it('should format past message date', () => {
    const date = moment(1516836994845);
    component.message = {
      time: date
    };

    expect(component.formattedDate).toBe(date.format('DD/MM/YYYY HH:mm'));
  });
});
