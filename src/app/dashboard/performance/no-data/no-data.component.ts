import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'sl-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent implements OnInit {
  @Input() dataNotExists;
  @Input() type;
  @Output() showViewCodeModal = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  viewSnipped() {
    this.showViewCodeModal.emit(this.type);
  }

}
