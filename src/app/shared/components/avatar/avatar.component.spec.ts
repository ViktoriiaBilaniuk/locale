import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {

  let component;

  beforeEach(() => {
    component = new AvatarComponent();
  });

  it ('should set showPlaceholder to true', () => {
    component.onError();
    expect(component.showPlaceholder).toBeTruthy();
  });

  it ('should set showPlaceholder to false', () => {
    component.ngOnChanges('');
    expect(component.showPlaceholder).toBeFalsy();
  });

});
