import { TagFilterComponent } from './tag-filter.component';

describe('TagFilterComponent', () => {
  let component;
  const removeMock = {
    emit: function () {}
  };

  beforeEach(() => {
    component = new TagFilterComponent();
    component.remove = removeMock;
  });

  it ('should emit value', () => {
    const removeSpy = spyOn(removeMock, 'emit');
    component.onRemoveClick();
    expect(removeSpy).toHaveBeenCalled();
  });
});

