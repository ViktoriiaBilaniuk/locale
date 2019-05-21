import { UtilsService } from './utils.service';

describe('Utils Service', () => {

  let service;

  beforeEach(() => {
    service = new UtilsService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show error modal', () => {
    expect(service.errorModalConfig.isVisible).toEqual(false);

    service.showErrorModal('some error');

    expect(service.errorModalConfig.isVisible).toEqual(true);
    expect(service.errorModalConfig.text).toEqual('some error');
  });

  it('should hide error modal', () => {
    service.showErrorModal({message: 'some error'});
    service.hideErrorModal();
    expect(service.errorModalConfig.isVisible).toEqual(false);
  });

  it('should show info modal', () => {
    expect(service.infoModalConfig.isVisible).toEqual(false);

    service.showInfoModal('title1', 'text2');

    expect(service.infoModalConfig.isVisible).toEqual(true);
    expect(service.infoModalConfig.title).toEqual('title1');
    expect(service.infoModalConfig.text).toEqual('text2');
  });

  it('should hide info modal', () => {
    service.showInfoModal('title1', 'text2');
    service.hideInfoModal();
    expect(service.infoModalConfig.isVisible).toEqual(false);
  });
});
