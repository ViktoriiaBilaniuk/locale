import { ChipInputComponent } from './chip-input.component';
import {
  DEFAULT_OPTIONS_CHAT_INPUT, DEFAULT_VENUE_OPTIONS_CHAT_INPUT, SUGGESTIONS_CHAT_INPUT,
  VENUE_OPTIONS_CHAT_INPUT
} from '../../../../test/mocks/details-mocks';

describe('ChipInputComponent', () => {
  let component: ChipInputComponent;
  const venueOptions = VENUE_OPTIONS_CHAT_INPUT;
  const suggestions = SUGGESTIONS_CHAT_INPUT;
  const searchValue = 'val1';
  const searchEvent = { keyCode: 10 };
  const searchSuggestions = [{ title: 'val11'}];

  beforeEach(() => {
    component = new ChipInputComponent();
    component.suggestions = undefined;
    component.defaultOptions = DEFAULT_OPTIONS_CHAT_INPUT;
    component.venueOptions = venueOptions;
    component.otherOptions = [{ title: 'val11'}, {title: 'val2'}];
    component.searchInput = {
      nativeElement: {
        value: 'value',
        blur: function () {}
      }
    } as any;
  });

  it ('should set suggestions', () => {
    component.setSuggestions();
    expect(component.suggestions).toEqual(suggestions);
  });

  it ('should set otherOptions', () => {
    component.setSuggestions();
    expect(component.otherOptions).toEqual(suggestions);
  });

  it ('should set suggestions on search', () => {
    component.search(searchValue, searchEvent);
    expect(component.suggestions).toEqual(searchSuggestions);
  });

  describe('on add new venue option', () => {
    const valueToAdd = 'some value';
    const itemToAdd = { value: 'some_value', title: 'Some value' };
    const venueOptionsAfterAddNew = [{ value: 'some_value', title: 'Some value' }];

    beforeEach(() => {
      component.venueOptions = [];
      component.onAdd = { emit: function() {} } as any;
      component.otherOptions = [];
      component.suggestions = [];
    });

    it ('should add venueOption', () => {
      component.addCustomItem(valueToAdd);
      expect(component.venueOptions).toEqual(venueOptionsAfterAddNew);
    });

    it ('should emit value onAdd', () => {
      const onAddSpy = spyOn(component.onAdd, 'emit');
      component.addCustomItem(valueToAdd);
      expect(onAddSpy).toHaveBeenCalled();
    });

    it ('should add item', () => {
      component.addItem(itemToAdd);
      expect(component.venueOptions).toEqual(venueOptionsAfterAddNew);
    });

    it ('should emit item onAdd', () => {
      const onAddSpy = spyOn(component.onAdd, 'emit');
      component.addItem(itemToAdd);
      expect(onAddSpy).toHaveBeenCalled();
    });
  });

  it('should clear input', () => {
    component.clearInput();
    expect(component.searchInput.nativeElement.value).toBe('');
  });

  it('should set showSuggestions to false', () => {
    component.showSuggestions = true;
    component.closeSugestions();
    expect(component.showSuggestions).toBeFalsy();
  });

  it('should return transformed value', () => {
    const result = {title: 'Value', value: 'value'};
    expect(component.transformedItem('value')).toEqual(result);
  });

  it('should set showSuggestions to true', () => {
    component.focusInput();
    expect(component.showSuggestions).toBeTruthy();
  });

  describe('on remove value', () => {
    const itemToRemove = {value: 'item2', title: 'Item2'};
    const resultOptions = [{value: 'item1', title: 'Item1'}];
    beforeEach(() => {
      component.venueOptions = DEFAULT_VENUE_OPTIONS_CHAT_INPUT;
    });

    it('should remove item', () => {
      component.removeItem(itemToRemove);
      expect(component.venueOptions).toEqual(resultOptions);
    });

  });

});
