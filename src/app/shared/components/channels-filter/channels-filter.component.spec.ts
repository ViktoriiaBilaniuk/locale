import { ChannelsFilterComponent } from './channels-filter.component';

describe('ChannelsFilterComponent', () => {

  let component;
  const channelsMock = [
    {selected: false},
    {selected: false}
  ];
  const confirmMock = {
    emit: function () {}
  };

  beforeEach(() => {
    component = new ChannelsFilterComponent();
    component.channels = channelsMock;
    component.confirm = confirmMock;
  });

  it ('should return false', () => {
    expect(component.allFilterChecked).toBeFalsy();
  });

  it ('should return selected filters', () => {
    expect(component.selected).toEqual([]);
  });

  it ('should change selected status', () => {
    const item = {selected: false};
    component.select(item);
    expect(item.selected).toBeTruthy();
  });

  it ('should emit clickOutside', () => {
    component.clickOutside = confirmMock;
    const clickOutsideSpy = spyOn(confirmMock, 'emit');
    component.onClickedOutside();
    expect(clickOutsideSpy).toHaveBeenCalledWith(false);
  });

});
