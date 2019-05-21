import { ChannelsTableComponent } from './channels-table.component';
import { CHANGE_DETECTION, NETWORK_PROXY, NETWORKS_SERVICE } from '../../../test/stubs/service-stubs';
import { of } from 'rxjs';

describe('ChannelsTableComponent', () => {
  let component;

  const dataMock = [
    {status: 'disconnected'},
    {status: 'connected'},
  ];

  const channelTableMock = {nativeElement: {click: function() {}}};

  beforeEach(() => {
    component = new ChannelsTableComponent(NETWORKS_SERVICE, NETWORK_PROXY, CHANGE_DETECTION);
    component.data = dataMock;
    component.channelTable = channelTableMock;
  });

  it ('should sort data', () => {
    const sortedDataMock = [
      {status: 'disconnected'},
      {status: 'connected'},
    ];
    component.ngOnChanges({data: true});
    expect(component.data).toEqual(sortedDataMock);
  });

  it ('should return name', () => {
    expect(component.getSortBy('channel')).toEqual('name');
  });

  it ('should return sortBy', () => {
    expect(component.sortBy).toEqual('status');
  });

  it ('should return sortOrder', () => {
    expect(component.sortOrder).toEqual('asc');
  });

  it ('should return empty string', () => {
    expect(component.getOrder('name')).toEqual('');
  });

  it ('should return status name', () => {
    expect(component.getStatusName('name')).toEqual('Channels.name');
  });

  it ('should set next value for filter', () => {
    const filterMock = {sortOrder: 'asc', sortBy: 'name'};
    component.sort('name');
    expect(component.filter.value).toEqual(filterMock);
  });

  describe('openConfirmModal', () => {

    it ('should set channelToDelete', () => {
      component.openConfirmModal(1);
      expect(component.channelToDelete).toEqual(1);
    });

    it ('should set visibleConfirmWindow to true', () => {
      component.openConfirmModal(1);
      expect(component.visibleConfirmWindow).toBeTruthy();
    });

  });

  describe('closeConfirmModal', () => {

    it ('should set channelToDelete to undefined', () => {
      component.closeConfirmModal();
      expect(component.channelToDelete).toEqual(undefined);
    });

    it ('should set visibleConfirmWindow to false', () => {
      component.closeConfirmModal();
      expect(component.visibleConfirmWindow).toBeFalsy();
    });

  });

  describe('removeChannel', () => {
    let removeChannelSpy;

    beforeEach(() => {
      removeChannelSpy = spyOn(NETWORKS_SERVICE, 'removeChannel').and.returnValue(of({}));
    });

    it ('should call removeChannel', () => {
      component.removeChannel();
      expect(removeChannelSpy).toHaveBeenCalled();
    });

    it ('should call refreshData', () => {
      const refreshDataSpy = spyOn(component, 'refreshData');
      component.removeChannel();
      expect(refreshDataSpy).toHaveBeenCalled();
    });

    it ('should call closeConfirmModal', () => {
      const closeConfirmModalSpy = spyOn(component, 'closeConfirmModal');
      component.removeChannel();
      expect(closeConfirmModalSpy).toHaveBeenCalled();
    });

  });

  it ('should call connectChannels', () => {
    const connectChannelsSpy = spyOn(NETWORK_PROXY, 'connectChannels');
    component.reconnectClick(1);
    expect(connectChannelsSpy).toHaveBeenCalled();
  });

  it ('should emit value', () => {
    const emitMock = {emit: function() {}};
    component.onAddChannelClick = emitMock;
    const emitSpy = spyOn(component.onAddChannelClick, 'emit');
    component.addChannelClick();
    expect(emitSpy).toHaveBeenCalled();
  });

  it ('should emit value on refresh', () => {
    const emitMock = {emit: function() {}};
    component.onRefresh = emitMock;
    const emitSpy = spyOn(component.onRefresh, 'emit');
    component.refreshData();
    expect(emitSpy).toHaveBeenCalled();
  });
});
