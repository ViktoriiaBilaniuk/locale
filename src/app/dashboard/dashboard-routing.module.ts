import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DetailsComponent} from './details/details.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { EventsComponent } from './events/events.component';
import { PerformanceComponent } from './performance/performance.component';
import { FilesComponent } from './files/files.component';
import { Permissions } from '../core/services/permissions/permissions.constant';
import { VenueIdResolve } from '../core/resolvers/venue-id.resolve';
import { ChannelsComponent } from './channels/channels.component';
import { NetworksComponent } from './channels/networks/networks.component';
import { AdvertisementComponent } from './advertisement/advertisement.component';

export const DASHBOARD_ROUTES: Routes = [
  { path: '', component: DashboardComponent,
    runGuardsAndResolvers: 'always',
    resolve: {
      venueData: VenueIdResolve
    },
    children: [
      { path: 'details', component: DetailsComponent },
      { path: 'events', component: EventsComponent },
      { path: 'performance',
        component: PerformanceComponent,
        data: { permission: Permissions.STATS} },
      { path: 'schedule',
        component: ScheduleComponent,
        data: { permission: Permissions.INCOMING_POSTS}
      },
      { path: 'files', component: FilesComponent },
      { path: 'networks', component: NetworksComponent },
      { path: 'channels',
        component: ChannelsComponent,
        data: { permission: Permissions.CHANNELS}},
      { path: 'ads', component: AdvertisementComponent,
        data: { permission: Permissions.ADVERTISEMENT}},
      { path: '', pathMatch: 'full', redirectTo: 'details'}
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(DASHBOARD_ROUTES),
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutingModule {}


