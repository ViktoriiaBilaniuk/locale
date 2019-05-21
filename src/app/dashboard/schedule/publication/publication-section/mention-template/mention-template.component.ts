import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sl-mention-template',
  templateUrl: './mention-template.component.html',
  styleUrls: ['./mention-template.component.scss']
})
export class MentionTemplateComponent implements OnInit {
  @Input() item: any;

  constructor() { }

  ngOnInit() {
  }

}
