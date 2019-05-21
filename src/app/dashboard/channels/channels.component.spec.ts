import { ChannelsComponent } from './channels.component';
import { NETWORKS_SERVICE, PERMISSIONS, ROUTE, ROUTER, STORE_STUB } from '../../test/stubs/service-stubs';
import { of } from 'rxjs';

describe('ChannelsComponent', () => {

  let component;
  const headerMock = {
    nativeElement: {
     click: function() {}
    }
  };

  beforeEach(() => {
    component = new ChannelsComponent(NETWORKS_SERVICE, PERMISSIONS, ROUTE, ROUTER, STORE_STUB);
  });

  describe('getVenueId', () => {

    let selectSpy, getConnectedChannelsSpy;

    beforeEach(() => {
      selectSpy = spyOn(STORE_STUB, 'select').and.returnValue(of(1));
      getConnectedChannelsSpy = spyOn(NETWORKS_SERVICE, 'getConnectedChannels').and.returnValue(of({list: []}));
      component.header = headerMock;
    });

    it('should select value', () => {
      component.getVenueId();
      expect(selectSpy).toHaveBeenCalledWith('venueId');
    });

    it('should define venueId', () => {
      component.getVenueId();
      expect(component.venueId).toBeDefined();
    });

    it('should set loading to false', () => {
      component.getVenueId();
      expect(component.loading).toBeFalsy();
    });

    it('should call getConnectedChannels', () => {
      component.getVenueId();
      expect(getConnectedChannelsSpy).toHaveBeenCalled();
    });

    it('should define allChannels', () => {
      component.getVenueId();
      expect(component.allChannels).toBeDefined();
    });

    it('should define channels', () => {
      component.getVenueId();
      expect(component.channels).toBeDefined();
    });
  });

  describe('onChangeChannels', () => {
    const eventMock = [{network: 'facebook'}];
    const allChannelsMock = [{network: 'facebook'}, {network: 'instagram'}];
    const filteredChannelsMock = [{network: 'facebook'}];

    beforeEach(() => {
      component.allChannels = allChannelsMock;
    });

    it('should set filtered channels', () => {
      component.onChangeChannels(eventMock);
      expect(component.channels).toEqual(filteredChannelsMock);
    });

    it('should set channels', () => {
      component.onChangeChannels([]);
      expect(component.channels).toEqual(allChannelsMock);
    });

  });

  it('should set visibleAddModal to true', () => {
    component.openModal();
    expect(component.visibleAddModal).toBeTruthy();
  });

  it('should set visibleAddModal to false', () => {
    component.closeModal();
    expect(component.visibleAddModal).toBeFalsy();
  });
});
