import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {
  errorModalConfig = {
    isVisible: false
  } as any;
  infoModalConfig = {
    isVisible: false
  } as any;

  constructor() { }

  showErrorModal(message) {
    this.errorModalConfig.isVisible = true;
    this.errorModalConfig.text = message;
  }

  hideErrorModal() {
    this.errorModalConfig.isVisible = false;
  }

  showInfoModal(title, text) {
    this.infoModalConfig.isVisible = true;
    this.infoModalConfig.text = text;
    this.infoModalConfig.title = title;
  }

  hideInfoModal() {
    this.infoModalConfig.isVisible = false;
  }
}
