import { Component, Input, OnInit } from '@angular/core';
import { Store } from '../../../../core/store/store';

@Component({
  selector: 'sl-collapsable-section',
  templateUrl: './collapsable-section.component.html',
  styleUrls: ['./collapsable-section.component.scss']
})
export class CollapsableSectionComponent implements OnInit {
  @Input() title;
  @Input() openSection = false;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  headerClick() {
    this.openSection = !this.openSection;
    this.setPublicationSectionStatus();
  }

  setPublicationSectionStatus() {
    if (this.title === 'Channels.publication') {
      this.store.set('collapse-publication', !this.openSection);
    }
  }


}
