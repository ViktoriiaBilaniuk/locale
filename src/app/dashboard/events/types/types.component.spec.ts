import { TypesComponent } from './types.component';

describe('TypesComponent', () => {

  let component: TypesComponent;
  const filtersMock = [
    {category: 'community', selected: true},
    {category: 'sports', selected: true},
  ];

  beforeEach(() => {
    component = new TypesComponent();
    component.filtersList = filtersMock;
  });

  afterAll(() => {
    component = null;
  });

  it('should unselect categories', () => {
    component.filtersList = [
      {category: 'community', selected: true},
      {category: 'sports', selected: true},
    ];
    const item = {category: 'sports', selected: true};
    component.select(item);
    expect(item.selected).toBeFalsy();
  });

  it('should emit categories', () => {
    const onTypesSelectedSpy = spyOn(component, 'onTypesSelected');
    component.onTypesSelected.subscribe((val) => {
      expect(onTypesSelectedSpy).toHaveBeenCalledWith(component.filtersList);
    });
  });

  it ('should return true for all selected filters', () => {
    expect(component.allFilterChecked).toBeTruthy();
  });

  describe('set allFilterChecked', () => {
    it ('should set value for all filters', () => {
      component.allFilterChecked = true;
      expect(component.filtersList).toEqual(filtersMock);
    });

    it ('should emit value in onTypesSelected', () => {
      const onTypesSelectedSpy = spyOn(component.onTypesSelected, 'emit');
      component.allFilterChecked = true;
      expect(onTypesSelectedSpy).toHaveBeenCalled();
    });
  });

});
