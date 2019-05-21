import { DetailsItemComponent } from './details-item.component';

describe('DetailsItemComponent', () => {
  let component: DetailsItemComponent;
  const data = '1';

  beforeEach(() => {
    component = new DetailsItemComponent();
    component.data = data;
    component.editMode = true;
    component.title = 'title';
  });

  it ('should set edit mode to false', () => {
    component.ngOnChanges();
    expect(component.editMode).toBeFalsy();
  });

  it ('should set description limit', () => {
    component.showMore();
    expect(component.descriptionLimit).toEqual(1000);
  });

  it ('should set edit mode to false', () => {
    component.editVenueDetails(data);
    expect(component.editMode).toBeFalsy();
  });

  it ('should set edit mode to false in editVenueDetails', () => {
    const newValue = '2';
    component.editVenueDetails(newValue);
    expect(component.editMode).toBeFalsy();
  });

  it ('should return title', () => {
    expect(component.getTitle()).toEqual('Rightbar.title');
  });

  it ('should return false', () => {
    expect(component.getRequiredStatus()).toBeTruthy();
  });

  it ('should return true', () => {
    component.title = 'localAttractionsAndEvents';
    expect(component.getRequiredStatus()).toBeFalsy();
  });
});
