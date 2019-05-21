import { ChipComponent } from './chip.component';

describe('ChipComponent', () => {
  let component: ChipComponent;

  beforeEach(() => {
   component = new ChipComponent();
   component.remove = { emit: function() {}} as any;
  });

  it('should emit value', () => {
    const emitSpy = spyOn(component.remove, 'emit');
    component.removeItem();
    expect(emitSpy).toHaveBeenCalled();
  });
});
