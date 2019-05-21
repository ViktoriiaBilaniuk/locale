import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ParticipantsResolve } from '../core/resolvers/participants.resolve';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { InputTrimModule } from 'ng2-trim-directive';
import { MatChipsModule, MatInputModule } from '@angular/material';
import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { EventsComponent } from './events/events.component';
import { HeaderComponent } from './header/header.component';
import { CurrentUserComponent } from './header/current-user/current-user.component';
import { ChatsComponent } from './right-sidebar/chats/chats.component';
import { VenueSearchComponent } from './header/venue-search/venue-search.component';
import { DetailsComponent } from './details/details.component';
import { LocationComponent } from './details/location/location.component';
import { ObjectiveComponent } from './details/objective/objective.component';
import { DemographicComponent } from './details/demographic/demographic.component';
import { MenusComponent } from './details/menus/menus.component';
import { DetailsItemComponent } from './details/details-item/details-item.component';
import { OpeningHoursComponent } from './details/opening-hours/opening-hours.component';
import { TimeSliderComponent } from './details/opening-hours/time-slider/time-slider.component';
import { NamedLinksComponent } from './details/named-links/named-links.component';
import { LinkFormComponent } from './details/named-links/link-form/link-form.component';
import { TargetMarketComponent } from './details/target-market/target-market.component';
import { ChipInputComponent } from './details/target-market/chip-input/chip-input.component';
import { ChipComponent } from './details/target-market/chip/chip.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ChatBodyComponent } from './right-sidebar/chats/chat-body/chat-body.component';
import { ChatItemComponent } from './right-sidebar/chats/chat-item/chat-item.component';
import { ChatActionsAreaComponent } from './right-sidebar/chats/chat-actions-area/chat-actions-area.component';
import { ChatToastComponent } from './right-sidebar/chats/chat-toast/chat-toast.component';
import { ThreadsComponent } from './header/venue-search/threads/threads.component';
import { PerformanceComponent } from './performance/performance.component';
import { PerformanceFiltersComponent } from './performance/performance-filters/performance-filters.component';
import { SmallChartComponent } from './performance/small-chart/small-chart.component';
import { VenueIdResolve } from '../core/resolvers/venue-id.resolve';
import { PerformanceModalFilterComponent } from './performance/performance-modal-filter/performance-modal-filter.component';
import { PerformanceModalHeaderComponent } from './performance/performance-modal-header/performance-modal-header.component';
import { PerformancePostComponent } from './performance/performance-post/performance-post.component';
import { PerformanceModalDropdownComponent } from './performance/performance-modal-dropdown/performance-modal-dropdown.component';
import { SocialMediaComponent } from './performance/social-media/social-media.component';
import { PerformanceTitleComponent } from './performance/performance-title/performance-title.component';
import { ReachChartComponent } from './performance/social-media/reach-chart/reach-chart.component';
import { CalendarPickerComponent } from './events/calendar-picker/calendar-picker.component';
import { RadiusRangeComponent } from './events/radius-range/radius-range.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { EventComponent } from './events/event-list/event/event.component';
import { SortingComponent } from './events/sorting/sorting.component';
import { TypesComponent } from './events/types/types.component';
import { FilesComponent } from './files/files.component';
import { FilesItemComponent } from './files/files-item/files-item.component';
import { RightSidebarSearchComponent } from './files/right-sidebar-search/right-sidebar-search.component';
import { TagFilterComponent } from './files/tag-filter/tag-filter.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { NoDataComponent } from './performance/no-data/no-data.component';
import { PerformanceTableComponent } from './performance/performance-table/performance-table.component';
import { PerformanceChartComponent } from './performance/performance-chart/performance-chart.component';
import { ChannelsComponent } from './channels/channels.component';
import { ChannelsTableComponent } from './channels/channels-table/channels-table.component';
import { CodeBodyComponent } from './performance/view-code-modal/code-body/code-body.component';
import { NetworksComponent } from './channels/networks/networks.component';
import { DropFilesComponent } from './files/drop-files/drop-files.component';
import { CodeTitleComponent } from './performance/view-code-modal/code-title/code-title.component';
import { ViewCodeModalComponent } from './performance/view-code-modal/view-code-modal.component';
import { FunctionalItemComponent } from './schedule/functional-item/functional-item.component';
import { PublicationComponent } from './schedule/publication/publication.component';
import { PublicationHeaderComponent } from './schedule/publication/publication-header/publication-header.component';
import { CollapsableSectionComponent } from './schedule/publication/collapsable-section/collapsable-section.component';
import { PublicationSectionComponent } from './schedule/publication/publication-section/publication-section.component';
import { ChannelsSectionComponent } from './schedule/publication/channels-section/channels-section.component';
import {
  PublicationTextareaComponent
} from './schedule/publication/publication-section/publication-textarea/publication-textarea.component';
import { PhotoSectionComponent } from './schedule/publication/publication-section/photo-section/photo-section.component';
import {
  FacebookPublicationComponent
} from './schedule/publication/publication-section/facebook-publication/facebook-publication.component';
import {
  InstagramPublicationComponent
} from './schedule/publication/publication-section/instagram-publication/instagram-publication.component';
import { TwitterPublicationComponent } from './schedule/publication/publication-section/twitter-publication/twitter-publication.component';
import { FacebookPreviewComponent } from './schedule/publication/preview/facebook-preview/facebook-preview.component';
import { InstagramPreviewComponent } from './schedule/publication/preview/instagram-preview/instagram-preview.component';
import { TwitterPreviewComponent } from './schedule/publication/preview/twitter-preview/twitter-preview.component';
import { PreviewPlaceholderComponent } from './schedule/publication/preview/preview-placeholder/preview-placeholder.component';
import { PostDetailsComponent } from './schedule/post/post-details/post-details.component';
import { PostComponent } from './schedule/post/post/post.component';
import { ScheduleSectionComponent } from './schedule/publication/schedule-section/schedule-section.component';
import { AlbumSectionComponent } from './schedule/publication/publication-section/album-section/album-section.component';
import { PhotoItemComponent } from './schedule/publication/publication-section/album-section/photo-item/photo-item.component';
import { AlbumPreviewComponent } from './schedule/publication/preview/facebook-preview/album-preview/album-preview.component';
import { ContentPoolComponent } from './schedule/publication/publication-section/photo-section/content-pool/content-pool.component';
import { ContentFilesComponent } from './schedule/publication/content-files/content-files.component';
import { TimezonePickerModule } from 'ng2-timezone-selector';
import { TextMaskModule } from 'angular2-text-mask';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { AdsItemComponent } from './advertisement/ads-item/ads-item.component';
import { AdsDateTabsComponent } from './advertisement/ads-date-tabs/ads-date-tabs.component';
import { ExpandChatComponent } from './header/expand-chat/expand-chat.component';
import { MentionModule } from 'angular-mentions/mention';
import { MentionTemplateComponent } from './schedule/publication/publication-section/mention-template/mention-template.component';
import { ViewTabsComponent } from './schedule/view-tabs/view-tabs.component';
import { WeeklyViewComponent } from './schedule/weekly-view/weekly-view.component';
import { DayViewComponent } from './schedule/weekly-view/day-view/day-view.component';
import { MonthlyViewComponent } from './schedule/monthly-view/monthly-view.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CellTemplateComponent } from './schedule/monthly-view/cell-template/cell-template.component';
import {
  LinkedSectionComponent
} from './schedule/publication/publication-section/facebook-publication/linked-section/linked-section.component';
import {
  MainLinkComponent
} from './schedule/publication/publication-section/facebook-publication/linked-section/main-link/main-link.component';
import {
  LinkSectionComponent
} from './schedule/publication/publication-section/facebook-publication/linked-section/link-section/link-section.component';
// tslint:disable-next-line:max-line-length
import { CtaButtonsSelectionComponent } from './schedule/publication/publication-section/facebook-publication/linked-section/cta-buttons-selection/cta-buttons-selection.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LinkCarouselComponent } from './schedule/publication/preview/facebook-preview/link-carousel/link-carousel.component';
import { SitePreviewComponent } from './schedule/publication/preview/facebook-preview/site-preview/site-preview.component';

@NgModule({
  imports: [
    DashboardRoutingModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatChipsModule,
    MatInputModule,
    InputTrimModule,
    NgxUploaderModule,
    TimezonePickerModule,
    TextMaskModule,
    PickerModule,
    MentionModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgSelectModule,
  ],
  declarations: [
    DashboardComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    EventsComponent,
    HeaderComponent,
    CurrentUserComponent,
    ChatsComponent,
    ChatItemComponent,
    VenueSearchComponent,
    LocationComponent,
    ObjectiveComponent,
    DemographicComponent,
    MenusComponent,
    DetailsComponent,
    DetailsItemComponent,
    OpeningHoursComponent,
    TimeSliderComponent,
    NamedLinksComponent,
    LinkFormComponent,
    TargetMarketComponent,
    ChipInputComponent,
    ChipComponent,
    ScheduleComponent,
    ChatBodyComponent,
    ChatActionsAreaComponent,
    ChatToastComponent,
    ThreadsComponent,
    PerformanceComponent,
    PerformanceModalFilterComponent,
    PerformanceModalHeaderComponent,
    PerformancePostComponent,
    PerformanceModalDropdownComponent,
    SmallChartComponent,
    SocialMediaComponent,
    PerformanceTitleComponent,
    ReachChartComponent,
    PerformanceFiltersComponent,
    CalendarPickerComponent,
    RadiusRangeComponent,
    EventListComponent,
    EventComponent,
    SortingComponent,
    TypesComponent,
    FilesComponent,
    FilesItemComponent,
    RightSidebarSearchComponent,
    TagFilterComponent,
    ChannelsComponent,
    ChannelsTableComponent,
    NetworksComponent,
    DropFilesComponent,
    NoDataComponent,
    ViewCodeModalComponent,
    CodeTitleComponent,
    CodeBodyComponent,
    FunctionalItemComponent,
    PublicationComponent,
    PublicationHeaderComponent,
    CollapsableSectionComponent,
    PublicationSectionComponent,
    ChannelsSectionComponent,
    PublicationTextareaComponent,
    PhotoSectionComponent,
    FacebookPublicationComponent,
    InstagramPublicationComponent,
    TwitterPublicationComponent,
    FacebookPreviewComponent,
    InstagramPreviewComponent,
    TwitterPreviewComponent,
    CodeBodyComponent,
    PerformanceTableComponent,
    PerformanceChartComponent,
    PreviewPlaceholderComponent,
    PostDetailsComponent,
    PostComponent,
    ScheduleSectionComponent,
    AlbumSectionComponent,
    PhotoItemComponent,
    AlbumPreviewComponent,
    ContentPoolComponent,
    ContentFilesComponent,
    AdvertisementComponent,
    AdsItemComponent,
    AdsDateTabsComponent,
    ExpandChatComponent,
    MentionTemplateComponent,
    ViewTabsComponent,
    WeeklyViewComponent,
    DayViewComponent,
    MonthlyViewComponent,
    CellTemplateComponent,
    LinkedSectionComponent,
    MainLinkComponent,
    LinkSectionComponent,
    CtaButtonsSelectionComponent,
    LinkCarouselComponent,
    SitePreviewComponent,
  ],
  providers: [
    ParticipantsResolve,
    VenueIdResolve,
  ],
})
export class DashboardModule { }
