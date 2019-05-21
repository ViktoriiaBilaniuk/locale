import { ChannelsSectionComponent } from './channels-section.component';
import { PUBLICATION_PROXY_SERVICE } from '../../../../test/stubs/service-stubs';

describe('ChannelsSectionComponent', () => {
  let component;
  const channelMock = {
    network: 'facebook',
    id: 1,
    selected: false,
    status: 'online'
  };
  const channelsMock = [channelMock];

  beforeEach(() => {
    component = new ChannelsSectionComponent(PUBLICATION_PROXY_SERVICE);
    component.activeTab = 'facebook';
    component.selectedChannel = {_id: 1};
    component.channels = channelsMock;
  });

  it ('should call setSelectedChannel', () => {
    component.selectedChannel = true;
    const setSelectedChannelSpy = spyOn(component, 'setSelectedChannel');
    component.ngOnInit();
    expect(setSelectedChannelSpy).toHaveBeenCalled();
  });

  describe('select', () => {
    const itemMock = {
      selected: false,
      status: 'online'
    };

    it ('should set selected state to true', () => {
      component.select(itemMock);
      expect(itemMock.selected).toBeTruthy();
    });

    it ('should set selected channels to service', () => {
      spyOn(component, 'getSelectedChannels').and.returnValue([]);
      component.select(itemMock);
      expect(PUBLICATION_PROXY_SERVICE.selectedChannels).toEqual([]);
    });
  });

  it ('should return channels by network', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'networkValue').and.returnValue('facebook');
    expect(component.channelsByNetwork()).toEqual(channelsMock);
  });

  describe('setSelectedChannel', () => {
    let selectSpy;

    beforeEach(() => {
      selectSpy = spyOn(component, 'select');
    });

    it ('should call select with channel to select', () => {
      component.setSelectedChannel();
      expect(selectSpy).toHaveBeenCalledWith(channelMock);
    });

    it ('should set selected for current channel to true', () => {
      component.setSelectedChannel();
      expect(channelMock.selected).toBeFalsy();
    });

    it ('should init selectedChannels in PublicationProxyService', () => {
      component.setSelectedChannel();
      expect(PUBLICATION_PROXY_SERVICE.selectedChannels).toBeDefined();
    });

    it ('should call setSelectedChannel', () => {
      const changesMock = {selectedChannel: {currentValue: 1}};
      const setSelectedChannelSpy = spyOn(component, 'setSelectedChannel');
      component.ngOnChanges(changesMock);
      expect(setSelectedChannelSpy).toHaveBeenCalled();
    });
  });

  it ('should return selected channels', () => {
    expect(component.getSelectedChannels()).toEqual([]);
  });

  it ('should unselect channels', () => {
    component.clearSelectedChannels();
    expect(component.channels).toEqual(channelsMock);
  });

  it ('should return network from service', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'networkValue').and.returnValue('facebook');
    expect(component.network).toEqual('facebook');
  });
});

