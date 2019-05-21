import { FilesItemComponent } from './files-item.component';
import { TRACK_STUB, UTILS_STUB } from '../../../test/stubs/service-stubs';

describe('FilesItemComponent', () => {

  let component;
  const utilsStub = UTILS_STUB;
  const trackStub = TRACK_STUB;
  const fileMock = {
    id: 1,
    index: 0,
    name: 'name',
    tags: [{name: 'tag'}]
  };
  const onTagClickMock = {
    emit: function() {}
  };
  const onDeleteMock = {
    emit: function() {}
  };
  const nameInputRefMock = {
    nativeElement: {
      value: '1'
    }
  };
  let onUpdateSpy;

  beforeEach(() => {
    component = new FilesItemComponent(utilsStub, trackStub);
    component.tags = [];
    onUpdateSpy = spyOn(component.onUpdate, 'emit');
    component.onTagClick = onTagClickMock;
    component.onDelete = onDeleteMock;
    component.nameInputRef = nameInputRefMock;
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component.file = fileMock;
    });

    it ('should set newFile', () => {
      component.ngOnChanges(undefined);
      expect(component.newFile).toEqual(fileMock);
    });

    it ('should set tags', () => {
      component.ngOnChanges(undefined);
      expect(component.tags).toEqual(fileMock.tags);
    });
  });

  it ('should add new tag', () => {
    const eventMock = {input: '', value: 'value'};
    component.add(eventMock);
    expect(component.tags).toEqual([{ name: 'value' }]);
  });

  it ('should remove tag', () => {
    const tagToRemove = 1;
    component.tags = [1];
    component.remove(tagToRemove);
    expect(component.tags).toEqual([]);
  });

  describe('onSaveClick', () => {
    beforeEach(() => {
      component.newFile = fileMock;
    });

    it ('should emit value', () => {
      component.onSaveClick();
      expect(onUpdateSpy).toHaveBeenCalled();
    });

    it ('should call fileDetailsUpdated', () => {
      const fileDetailsUpdatedSpy = spyOn(trackStub, 'fileDetailsUpdated');
      component.onSaveClick();
      expect(fileDetailsUpdatedSpy).toHaveBeenCalled();
    });
  });

  describe('transformNewFile', () => {
    beforeEach(() => {
      component.newFile = fileMock;
    });

    it ('should set name in newFile', () => {
      component.transformNewFile();
      expect(component.newFile.name).toEqual('1');
    });

    it ('should set tags in newFile', () => {
      component.transformNewFile();
      expect(component.newFile.tags).toEqual([]);
    });

    it ('should set index in newFile', () => {
      component.index = 1;
      component.transformNewFile();
      expect(component.newFile.index).toEqual(1);
    });
  });

  it ('should check if name is valid', () => {
    nameInputRefMock.nativeElement.value = '';
    const showErrorModalSpy = spyOn(utilsStub, 'showErrorModal');
    component.checkNameValid();
    expect(showErrorModalSpy).toHaveBeenCalled();
  });

  describe('cancel', () => {
    beforeEach(() => {
      component.newFile = fileMock;
      component.file = fileMock;
    });
    it ('should set tags in cancel method', () => {
      component.cancel();
      expect(component.tags).toEqual(fileMock.tags);
    });

    it ('should set edit mode to false', () => {
      component.cancel();
      expect(component.editMode).toBeFalsy();
    });
  });

  it ('should split tags', () => {
    component.file = {tags: [{name: 'some,tag'}]};
    component.splitTags();
    expect(component.tags).toEqual([{name: 'some'}, {name: 'tag'}]);
  });

  it ('should remove file name extention', () => {
    component.file = fileMock;
    component.file.name = 'name.pdf';
    expect(component.removeExtention()).toEqual('name');
  });

  it ('should add extention', () => {
    component.extention = '.pdf';
    expect(component.addExtention(fileMock)).toEqual(fileMock.name + '.pdf');
  });

  describe('getClass', () => {
    beforeEach(() => {
      component.file = fileMock;
    });
    it ('should return icon-doc class name', () => {
      component.file.type = 'file';
      expect(component.getClass()).toEqual('icon-doc');
    });

    it ('should return icon-control-play class name', () => {
      component.file.type = 'video';
      expect(component.getClass()).toEqual('icon-control-play');
    });

    it ('should return icon-doc as default class name', () => {
      component.file.type = 'type';
      expect(component.getClass()).toEqual('icon-doc');
    });
  });

  describe('tagClick', () => {
    it ('should emit value onTagClick', () => {
      const onTagClickSpy = spyOn(onTagClickMock, 'emit');
      component.tagClick(1);
      expect(onTagClickSpy).toHaveBeenCalled();
    });

    it ('should call tagClicked', () => {
      const tagClickedSpy = spyOn(trackStub, 'tagClicked');
      component.tagClick(1);
      expect(tagClickedSpy).toHaveBeenCalled();
    });
  });

  it ('should call openedFile', () => {
    const openedFileSpy = spyOn(trackStub, 'openedFile');
    component.openImage({url: 'url'});
    expect(openedFileSpy).toHaveBeenCalled();
  });

  describe('removeFile', () => {
    it ('should call fileRemoved', () => {
      const fileRemovedSpy = spyOn(trackStub, 'fileRemoved');
      component.removeFile(1);
      expect(fileRemovedSpy).toHaveBeenCalled();
    });

    it ('should emit value on delete', () => {
      const onDeleteSpy = spyOn(onDeleteMock, 'emit');
      component.removeFile(1);
      expect(onDeleteSpy).toHaveBeenCalled();
    });
  });

  it ('should return true in isPngImage', () => {
    expect(component.isPngImage({url: 'url.png'})).toBeTruthy();
  });

  it ('should return image url', () => {
    expect(component.getImage({thumbnail: '1'})).toEqual('url(1)');
  });

});
