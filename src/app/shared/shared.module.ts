import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,
  MatTooltipModule,
  MatCheckboxModule, DateAdapter, MAT_DATE_FORMATS, NativeDateModule
} from '@angular/material';

import { ModalComponent } from './components/modal/modal.component';
import { ShowHidePasswordComponent } from './components/show-hide-password/show-hide-password.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { DateSliderComponent } from './components/date-slider/date-slider.component';
import { TrimPipe } from './pipes/trim.pipe';
import { TextareaComponent } from './components/textarea/textarea.component';
import { NewTabWrapperComponent } from './components/new-tab-wrapper/new-tab-wrapper.component';
import { PrettyNumberPipe } from './pipes/pretty-number.pipe';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { LoadingComponent } from './components/loading/loading.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ClickOutsideModule } from 'ng4-click-outside';
import { MessageComponent } from './components/message/message.component';
import { SharedPostComponent } from './components/message/shared-post/shared-post.component';
import { AttachmentComponent } from './components/message/attachment/attachment.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { LeftSidebarHeaderComponent } from '../dashboard/left-sidebar/left-sidebar-header/left-sidebar-header.component';
import { CardComponent } from './components/card/card.component';
import { MediaViewerComponent } from './components/media-viewer/media-viewer.component';
import { DateTabsComponent } from './components/date-tabs/date-tabs.component';
import { ChannelsSearchComponent } from './components/channels-search/channels-search.component';
import { ChannelsFilterComponent } from './components/channels-filter/channels-filter.component';
import { StatusSearchComponent } from './components/status-search/status-search.component';
import { StatusFilterComponent } from './components/status-filter/status-filter.component';
import { PerformanceModalComponent } from './components/performance-modal/performance-modal.component';
import { BlueDirective } from './directives/colors/blue.directive';
import { YellowDirective } from './directives/colors/yellow.directive';
import { PinkDirective } from './directives/colors/pink.directive';
import { GreyDirective } from './directives/colors/grey.directive';
import { RedDirective } from './directives/colors/red.directive';
import { BoldDirective } from './directives/colors/bold.directive';
import { BlackDirective } from './directives/colors/black.directive';
import { SortPipe } from './pipes/sort.pipe';
import { CookiesPanelComponent } from './components/cookies-panel/cookies-panel.component';
import { ItalicPipe } from './pipes/italic.pipe';
import { BoldPipe } from './pipes/bold.pipe';
import { CustomDateAdapter, DD_MM_YYYY_Format } from '../dashboard/date-formats-constants';
import { ChartComponent } from './components/chart/chart.component';
import { SortableLabelComponent } from './components/sortable-label/sortable-label.component';
import { DarkModalComponent } from './components/dark-modal/dark-modal.component';
import { LinkifyPipe } from './pipes/linkify.pipe';
import { StrikePipe } from './pipes/strike.pipe';
import { TransformTextService } from './services/transform-text.service';
import { TagPipe } from './pipes/tag.pipe';
import { TooltipLightComponent } from './components/tooltip-light/tooltip-light.component';
import { ReferencePipe } from './pipes/reference.pipe';
import { LimitPipe } from './pipes/limit.pipe';
import { PostDatePipe } from './pipes/post-date.pipe';
import { CheckDurationDirective } from './directives/check-duration.directive';
import { ConnectionModalComponent } from './components/connection-modal/connection-modal.component';
import { GreenDirective } from './directives/colors/green.directive';
import { PublicationTooltipComponent } from './components/publication-tooltip/publication-tooltip.component';
import { MentionLinkPipe } from './pipes/mention-link.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { TutorialComponent } from './components/tutorial/tutorial.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatTooltipModule,
    MatCheckboxModule,
    ClickOutsideModule,
    NativeDateModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    ModalComponent,
    ShowHidePasswordComponent,
    AvatarComponent,
    DateSliderComponent,
    TextareaComponent,
    TrimPipe,
    NewTabWrapperComponent,
    PrettyNumberPipe,
    TooltipComponent,
    LoadingComponent,
    DropdownComponent,
    MessageComponent,
    AttachmentComponent,
    AttachmentComponent,
    SharedPostComponent,
    LeftSidebarHeaderComponent,
    MediaViewerComponent,
    CardComponent,
    DateTabsComponent,
    ChannelsSearchComponent,
    ChannelsFilterComponent,
    StatusSearchComponent,
    StatusFilterComponent,
    PerformanceModalComponent,
    BlueDirective,
    YellowDirective,
    PinkDirective,
    GreyDirective,
    RedDirective,
    BoldDirective,
    BlackDirective,
    SortPipe,
    CookiesPanelComponent,
    ItalicPipe,
    BoldPipe,
    StrikePipe,
    ChartComponent,
    SortableLabelComponent,
    DarkModalComponent,
    LinkifyPipe,
    TagPipe,
    TooltipLightComponent,
    ReferencePipe,
    LimitPipe,
    PostDatePipe,
    CheckDurationDirective,
    ConnectionModalComponent,
    GreenDirective,
    PublicationTooltipComponent,
    MentionLinkPipe,
    TutorialComponent,
    SafePipe,
  ],
  exports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatTooltipModule,
    MatCheckboxModule,
    AvatarComponent,
    ModalComponent,
    ShowHidePasswordComponent,
    DateSliderComponent,
    TextareaComponent,
    TrimPipe,
    NewTabWrapperComponent,
    PrettyNumberPipe,
    TooltipComponent,
    LoadingComponent,
    DropdownComponent,
    TranslateModule,
    ClickOutsideModule,
    AttachmentComponent,
    MessageComponent,
    SharedPostComponent,
    LeftSidebarHeaderComponent,
    MediaViewerComponent,
    CardComponent,
    DateTabsComponent,
    ChannelsSearchComponent,
    ChannelsFilterComponent,
    StatusSearchComponent,
    StatusFilterComponent,
    PerformanceModalComponent,
    BlueDirective,
    YellowDirective,
    PinkDirective,
    GreyDirective,
    RedDirective,
    BoldDirective,
    SortPipe,
    SortableLabelComponent,
    CookiesPanelComponent,
    ItalicPipe,
    BoldPipe,
    StrikePipe,
    ChartComponent,
    LinkifyPipe,
    DarkModalComponent,
    TagPipe,
    TooltipLightComponent,
    ReferencePipe,
    LimitPipe,
    PostDatePipe,
    CheckDurationDirective,
    ConnectionModalComponent,
    GreenDirective,
    PublicationTooltipComponent,
    MentionLinkPipe,
    SafePipe,
    MentionLinkPipe,
    TutorialComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_Format},
    TransformTextService
  ]
})
export class SharedModule { }
