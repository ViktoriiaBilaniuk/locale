import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sl-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() post;

  constructor() { }

  ngOnInit() {
  }

}
