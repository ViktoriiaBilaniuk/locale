import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CTA_BUTTON } from '../link-constants';
import { Store } from '../../../../../../../core/store/store';
import { LinkedPostService } from '../../../../../../../core/services/publication/linked-post.service';

@Component({
  selector: 'sl-cta-buttons-selection',
  templateUrl: './cta-buttons-selection.component.html',
  styleUrls: ['./cta-buttons-selection.component.scss']
})
export class CtaButtonsSelectionComponent implements OnInit {

  @Output() change = new EventEmitter();

  selectedOption = '';
  options = [];
  subscription;
  collapsePublication = false;

  constructor(private store: Store, private linkedPostService: LinkedPostService) { }

  ngOnInit() {
    this.subscribeOnCollapseStatus();
    this.setOptions();
    this.setCallToActionButton();
  }

  subscribeOnCollapseStatus() {
    let timeoutValue = 0;
    this.subscription = this.store.select('collapse-publication')
      .subscribe((status: any) => {
        timeoutValue = status === false ? 300 : 100;
        setTimeout(() => {
          this.collapsePublication = status;
        }, timeoutValue);
      });
  }

  setOptions() {
    Object.values(CTA_BUTTON).forEach(value => {
      this.options.push(value);
    });
    this.selectedOption = this.options[0];
  }

  onButtonChange(e) {
    if (e === CTA_BUTTON.NO_BUTTON) {
      this.change.emit(null);
    } else {
      const buttonKey = Object.keys(CTA_BUTTON).find(key => CTA_BUTTON[key] === e);
      this.change.emit({key: buttonKey, value: e });
    }
  }

  setCallToActionButton() {
    if (this.linkedPostService.generalLinkedPost.callToActionButton) {
      this.selectedOption = this.linkedPostService.generalLinkedPost.callToActionButton.value;
    }
  }

}
