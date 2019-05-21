import { AttachmentComponent } from './attachment.component';
import { MessageTypes } from '../../../../core/services/chat/message-types';

describe('AttachmentComponent', () => {

  let component: AttachmentComponent;
  const videoMock = {
    nativeElement: {
      paused: false,
      play: function() {} as any,
      pause: function() {} as any,
    }
  };
  const placeholderMock = {
    nativeElement: {
      style: {
        display: ''
      }
    }
  };
  let playSpy, pauseSpy;

  beforeEach(() => {
    component = new AttachmentComponent();
    component.placeholder = placeholderMock;
    component.video = videoMock;
    playSpy = spyOn(videoMock.nativeElement, 'play');
    pauseSpy = spyOn(videoMock.nativeElement, 'pause');
  });

  it('should detect attachment type', () => {
    component.message = {
      type: MessageTypes.VIDEO
    };

    expect(component.isVideo).toBeTruthy();
    expect(component.type).toBe('media');
    expect(component.isImage).toBeFalsy();

    component.message = {
      type: MessageTypes.IMAGE
    };

    expect(component.isImage).toBeTruthy();
    expect(component.isVideo).toBeFalsy();
  });

  it('should get file name from message content', () => {
    component.message = {
      content: {
        name: 'test.png'
      }
    };

    expect(component.fileName).toBe('test.png');
  });

  it('should get file name from file url if there is empty content name', () => {
    component.message = {
      content: {
        url: 'folder/folder/123test.png'
      }
    };

    expect(component.fileName).toBe('123test.png');
  });

  it ('should play video', () => {
    component.play();
    expect(playSpy).toHaveBeenCalled();
  });

  it ('should hide default placeholder', () => {
    component.hideDefaultPlaceholder();
    expect(placeholderMock.nativeElement.style.display).toEqual('none');
  });

  it ('should pause video', () => {
    component.togglePlay();
    expect(pauseSpy).toHaveBeenCalled();
  });

  it ('should play video in togglePlay', () => {
    component.video.nativeElement.paused = true;
    component.togglePlay();
    expect(playSpy).toHaveBeenCalled();
  });

});
