import { UtilsService } from './core/services/utils/utils.service';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AutoUnsubscribe } from './shared/decorators/auto-unsubscribe';

@AutoUnsubscribe
@Component({
  selector: 'sl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(
    private translate: TranslateService,
    public utils: UtilsService) {
    translate.setDefaultLang('en');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  closeErrorModal() {
    this.utils.hideErrorModal();
  }

  closeInfoModal() {
    this.utils.hideInfoModal();
  }
}
