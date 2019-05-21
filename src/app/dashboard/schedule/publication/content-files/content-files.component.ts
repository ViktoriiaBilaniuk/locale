import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PublicationProxyService } from '../../../../core/services/publication/publication-proxy.service';
import { VenueService } from '../../../../core/services/venue/venue.service';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/internal/operators';
import { SRC_TYPE } from '../publication.constants';

@Component({
  selector: 'sl-content-files',
  template: '',
})
export class ContentFilesComponent implements OnInit, OnChanges {
  @Input() venueId;
  subscriptions = [];
  scrollToNewFiles: boolean;
  numberItemsToLoad = 20;
  skipNumber = 0;
  files = [];
  filter: BehaviorSubject<any>;
  searchValue = '';
  filterSubscription;

  constructor(
    private venueService: VenueService,
    private publicationProxyService: PublicationProxyService
  ) { }

  ngOnInit() {
    this.resetData();
    this.publicationProxyService.scrollToNewContentPoolFiles
      .subscribe(() => {
        this.onScroll();
      });
    this.publicationProxyService.contentFilesSearchText
      .subscribe(text => {
        this.onSearch(text);
      });
  }

  ngOnChanges(changes) {
    if (changes.scrollToNewFiles) {
      this.onScroll();
    }
  }

  private resetData() {
    this.publicationProxyService.contentFilesLoading = true;
    this.publicationProxyService.scrollToNewContentPoolFiles = new BehaviorSubject(false);
    this.publicationProxyService.contentFilesSearchText = new BehaviorSubject('');
    this.searchValue = '';
    this.skipNumber = 0;
    this.files = [];
    this.setupFilter();
  }

  private setupFilter () {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
    this.filter = new BehaviorSubject<any>(this.searchValue);
    this.filterSubscription = this.filter.pipe(debounceTime(900))
      .pipe(
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.skipNumber = 0;
        this.publicationProxyService.contentFilesLoading = true;
        this.fetchFiles(this.venueId, value);
      });
  }

  private fetchFiles(venueId, search?) {
    this.subscriptions.push(this.venueService.fetchFiles(venueId, this.skipNumber, this.numberItemsToLoad, search, 300)
      .subscribe(data => {
          this.getFiles.bind(this)(data['files']);
        }
      ));
  }

  private getFiles(files) {
    if (this.skipNumber) {
      this.files = [...this.getFilteredFiles(this.files), ...this.getFilteredFiles(files)];
    } else {
      this.files = this.getFilteredFiles(files);
    }
    this.publicationProxyService.contentFiles = this.files;
    this.scrollToNewFiles = !this.hasFiles(files.length);
    this.publicationProxyService.contentFilesLoading = false;
    if (this.getFilteredFiles(this.files).length < 15) {
      this.onScroll();
    }
  }

  private getFilteredFiles(files) {
    return files.filter(file => file.type === SRC_TYPE.IMAGE || file.type === SRC_TYPE.VIDEO);
  }

  hasFiles(length) {
    return length < this.numberItemsToLoad;
  }

  onScroll() {
    if (this.scrollToNewFiles) {
      this.skipNumber += this.numberItemsToLoad;
      this.fetchFiles(this.venueId, this.filter.value);
    }
  }

  onSearch(searchText) {
    this.filter.next(searchText);
    this.searchValue = searchText;
  }

}
