import { PublicationHeaderComponent } from './publication-header.component';
import { PUBLICATION_PROXY_SERVICE } from '../../../../test/stubs/service-stubs';
import { of } from 'rxjs';

describe('PublicationHeaderComponent', () => {

  let component;
  const tabsMock = [
    {title: 'facebook', active: false, visible: false},
    {title: 'instagram', active: false, visible: false},
    {title: 'twitter', active: false, visible: false},
  ];

  beforeEach(() => {
    component = new PublicationHeaderComponent(PUBLICATION_PROXY_SERVICE);
    component.channels = [];
  });

  it('should call subscribeOnNetwork', () => {
    const subscribeOnNetworkSpy = spyOn(component, 'subscribeOnNetwork');
    component.ngOnInit();
    expect(subscribeOnNetworkSpy).toHaveBeenCalled();
  });

  describe('ngOnChanges', () => {
    let setTabsSpy;

    beforeEach(() => {
      setTabsSpy = spyOn(component, 'setTabs');
      component.activeTab = '';
    });

    it ('should call setTabs', () => {
      component.ngOnChanges({channels: [1]});
      expect(setTabsSpy).toHaveBeenCalled();
    });

    it ('should unselect all tabs', () => {
      component.ngOnChanges({activeTab: true});
      component.tabs.forEach(tab => {
        expect(tab.selected).toBeFalsy();
      });
    });

    it ('should made unvisible all inactive tabs', () => {
      const actionMock = {actionName: 'edit', postId: 1};
      component.action = actionMock;
      const fbTab = tabsMock.find(elem => elem.title === 'facebook');
      component.ngOnChanges(actionMock);
      component.tabs.forEach(tab => {
        expect(tab.visible).toBeFalsy();
      });
    });

  });

  it ('should set visibe statuses for all tabs', () => {
    component.setTabs();
    component.tabs.forEach(tab => {
      expect(tab.visible).toBeFalsy();
    });
  });

  it ('should return false on getVisibleStatus', () => {
    expect(component.getVisibleStatus({title: 'facebook'})).toBeFalsy();
  });

  it ('should emit value in onSaveClick', () => {
    const onSaveSpy = spyOn(component.onSave, 'emit');
    component.onSaveClick();
    expect(onSaveSpy).toHaveBeenCalled();
  });

  it ('should emit value in tabClick', () => {
    const onTabClickSpy = spyOn(component.onTabClick, 'emit');
    component.tabClick({title: 'facebook'});
    expect(onTabClickSpy).toHaveBeenCalled();
  });

  describe('onSaveAndCopyClick', () => {
    let onSaveAndCopySpy, onShowTooltipSpy;

    beforeEach(() => {
      onSaveAndCopySpy = spyOn(component.onSaveAndCopy, 'emit');
      onShowTooltipSpy = spyOn(component, 'onShowTooltip');
    });

    it ('should emit onSaveAndCopy', () => {
      component.onSaveAndCopyClick();
      expect(onSaveAndCopySpy).toHaveBeenCalled();
    });

    it ('should call onShowTooltip', () => {
      component.onSaveAndCopyClick();
      expect(onShowTooltipSpy).toHaveBeenCalled();
    });

  });

  it ('should emit title', () => {
    const onSetTabClickSpy = spyOn(component.onSetTabClick, 'emit');
    component.onSetTab({title: 'title'});
    expect(onSetTabClickSpy).toHaveBeenCalledWith('title');
  });

  it ('should return copy button text', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'isScheduledPost').and.returnValue(of(true));
    expect(component.getCopyButtonText()).toEqual('Channels.scheduleAndCopy');
  });

  it ('should return save button text', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'isScheduledPost').and.returnValue(of(true));
    expect(component.getSaveButtonText()).toEqual('Channels.schedulePost');
  });
});
