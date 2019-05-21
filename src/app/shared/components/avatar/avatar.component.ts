import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'sl-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, OnChanges {
  @Input () avatar: string;
  showPlaceholder: boolean;
  constructor() {
  }

  onError () {
    this.showPlaceholder = true;
  }

  ngOnInit() {
  }
  ngOnChanges (changes) {
    this.showPlaceholder = false;
  }

}
