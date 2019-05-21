import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sl-left-sidebar-header',
  templateUrl: './left-sidebar-header.component.html',
  styleUrls: ['./left-sidebar-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeftSidebarHeaderComponent implements OnInit {
  @Input() collapsed;
  @Input() venueId;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
