import { ChatToastComponent } from './chat-toast.component';
import { STORE_STUB } from '../../../../test/stubs/service-stubs';
import { of } from 'rxjs/index';
import { EXPAND_STATUS } from '../../../header/expand-chat/expand-constants';

describe('ChatToastComponent', () => {

  let component;

  beforeEach(() => {
    component = new ChatToastComponent(STORE_STUB);
  });

  it ('should call subscribeOnExpandStatus', () => {
    const subscribeOnExpandStatusSpy = spyOn(component, 'subscribeOnExpandStatus');
    component.ngOnInit();
    expect(subscribeOnExpandStatusSpy).toHaveBeenCalled();
  });

  it ('should set expend to true', () => {
    spyOn(STORE_STUB, 'select').and.returnValue(of(EXPAND_STATUS.EXPANDED));
    component.subscribeOnExpandStatus();
    expect(component.expand).toBeTruthy();
  });

  describe('getPosition for contentPoolPage', () => {
    const indexes = [
      {value: 1, position: '3px'},
      {value: 2, position: '46px'},
      {value: 3, position: '89px'},
    ];

    beforeEach(() => {
      component.contentPoolPage = true;
    });

    it ('', () => {
      indexes.forEach(i => {
        component.index = i.value;
        expect(component.getPosition()).toEqual(i.position);
      });
    });

  });

  describe('getPosition for chat page', () => {
    const indexes = [
      {value: 1, position: '-103px'},
      {value: 2, position: '-146px'},
      {value: 3, position: '-189px'},
    ];

    beforeEach(() => {
      component.contentPoolPage = false;
    });

    it ('', () => {
      indexes.forEach(i => {
        component.index = i.value;
        expect(component.getPosition()).toEqual(i.position);
      });
    });
  });
});
