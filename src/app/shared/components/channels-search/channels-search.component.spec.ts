import { ChannelsSearchComponent } from './channels-search.component';

describe('ChannelsSearchComponent', () => {

  let component;

  beforeEach(() => {
    component = new ChannelsSearchComponent();
  });

  it ('should define ngOnChanges', () => {
    expect(component.activeChannels).toEqual([]);
  });

  describe('toggleMenu', () => {
    const eventMock = {
      stopPropagation: function() {}
    };

    it ('should call eventMock', () => {
      const stopPropagationSpy = spyOn(eventMock, 'stopPropagation');
      component.toggleMenu(eventMock);
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it ('should set channelMenuIsActive to true', () => {
      component.toggleMenu(eventMock);
      expect(component.channelMenuIsActive).toBeTruthy();
    });
  });

  it ('should set channelMenuIsActive', () => {
    component.onClickedOutside(true);
    expect(component.channelMenuIsActive).toBeTruthy();
  });

  describe('channels logic', () => {
    const channelsMock = [1, 2, 3];
    const activeChannelsMock = [];

    beforeEach(() => {
      component.channels = channelsMock;
      component.activeChannels = activeChannelsMock;
    });

    it ('should set allSelected to true', () => {
      component.allChannelsSelected();
      expect(component.allSelected).toBeTruthy();
    });
  });

  describe('changeChannels', () => {
    const onChangeChannelsMock = {
      emit: function () {}
    };
    let onChangeChannelsSpy;
    const channelsMock = [1];

    beforeEach(() => {
      onChangeChannelsSpy = spyOn(onChangeChannelsMock, 'emit');
      component.onChangeChannels = onChangeChannelsMock;
      component.channels = component.activeChannels = [];
    });
    it ('should emit value', () => {
      component.changeChannels(channelsMock);
      expect(onChangeChannelsSpy).toHaveBeenCalledWith(channelsMock);
    });

    it ('should set activeChannels', () => {
      component.changeChannels(channelsMock);
      expect(component.activeChannels).toEqual(channelsMock);
    });
  });

});
