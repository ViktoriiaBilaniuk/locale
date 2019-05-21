import { CodeBodyComponent } from './code-body.component';
import { CLIPBOARD_SERVICE } from '../../../../test/stubs/service-stubs';

describe('CodeBodyComponent', () => {

  let component;

  beforeEach(() => {
    component = new CodeBodyComponent(CLIPBOARD_SERVICE);
    component.codeSnippet = true;
  });

  it ('should call copyFromContent', () => {
    const copyFromContentSpy = spyOn(CLIPBOARD_SERVICE, 'copyFromContent');
    component.copyCode();
    expect(copyFromContentSpy).toHaveBeenCalled();
  });

  it ('should set isAnimation to true', () => {
    component.setAnimationOnTooltip();
    expect(component.isAnimation).toBeTruthy();
  });

  it ('should set isAnimation to false', () => {
    component.resetAnimationOnTooltip();
    expect(component.isAnimation).toBeFalsy();
  });

});
