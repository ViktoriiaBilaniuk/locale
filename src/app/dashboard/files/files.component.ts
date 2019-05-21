import { Component, OnInit, OnDestroy } from '@angular/core';
import { VenueService } from '../../core/services/venue/venue.service';
import { Subscription ,  BehaviorSubject } from 'rxjs';
import { TrackingSerivce } from '../../core/services/tracking/tracking.service';
import { UtilsService } from '../../core/services/utils/utils.service';
import { Store } from '../../core/store/store';
import { fadeInAnimation } from '../../shared/animations/fade-in.animation';
import { AutoUnsubscribe } from '../../shared/decorators/auto-unsubscribe';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/internal/operators';

@Component({
  selector: 'sl-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  animations: [fadeInAnimation],
})
export class FilesComponent implements OnInit, OnDestroy {
  venueId: any;
  venueFilesSubscriptions: Array<Subscription>;
  searchValue = '';
  searchByTag = false;
  updatedFile;
  scrollToNewFiles: boolean;
  numberItemsToLoad = 20;
  skipNumber = 0;
  visibleConfirmWindow;
  fileIdForRemove;
  filter: BehaviorSubject<any>;
  filesLoading;
  filterSubscription;
  files = [];
  filesUploaddedOnClick = [];
  drag;

  constructor(
    private venueService: VenueService,
    private store: Store,
    private track: TrackingSerivce,
    public utils: UtilsService,
  ) {}

  ngOnInit() {
    this.venueFilesSubscriptions = [];
    this.getVenueId();
    this.track.contentPoolOpened();
    this.store.set('tutorialKey', 'pool');
  }

  private getVenueId () {
    this.filesLoading = true;
    this.venueFilesSubscriptions.push(this.store.select('venue-details')
      .pipe(
        filter((details: any) => details)
      )
      .subscribe((venue: any) => {
        this.filesLoading = true;
        this.venueId = venue.id;
        this.searchValue = '';
        this.searchByTag = false;
        this.skipNumber = 0;
        this.files = [];
        this.setupFilter();
      }));
  }

  fetchFiles(venueId, search?) {
    this.venueFilesSubscriptions.push(this.venueService.fetchFiles(venueId, this.skipNumber, this.numberItemsToLoad, search, 300)
      .subscribe(data => {
          this.getFiles.bind(this)(data['files']);
        }
      ));
  }

  getFiles(files) {
    if (this.skipNumber) {
      this.files = [...this.files, ...files];
    } else {
      this.files = files;
    }
    this.scrollToNewFiles = !this.hasFiles(files.length);
    this.filesLoading = false;
  }

  hasFiles(length) {
    return length < this.numberItemsToLoad;
  }

  setupFilter () {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
    this.filter = new BehaviorSubject<any>(this.searchValue);
    this.filterSubscription = this.filter
      .pipe(
        debounceTime(900),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.skipNumber = 0;
        this.filesLoading = true;
        this.fetchFiles(this.venueId, value);
      });
  }

  updateFile(e) {
    const fileBody = {
      name: e.name,
      tags: e.tags
    };
    const index = e['index'];
    this.venueFilesSubscriptions.push(this.venueService.updateFile(e['id'], fileBody)
      .subscribe( data => {
        this.updatedFile = data['file'];
        this.files[index] = this.updatedFile;
      })
    );
  }

  onTagClick(tag) {
    this.searchValue = tag.name;
    this.searchByTag = true;
    this.getFilesWithCurrentTag(tag);
  }

  onTagFilterRemove () {
    this.searchValue = '';
    this.searchByTag = false;
    this.skipNumber = 0;
    this.filesLoading = true;
    this.fetchFiles(this.venueId, '');
  }

  getFilesWithCurrentTag(tag) {
    this.venueFilesSubscriptions.push(this.venueService.fetchFilesByTag(this.venueId, tag.id)
      .subscribe(data => {
        this.files = data['files'];
      })
    );
  }

  onSearch(searchText) {
    this.filter.next(searchText);
    this.searchValue = searchText;
  }

  onScroll(event) {
    if (this.scrollToNewFiles && event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight) {
      this.skipNumber += this.numberItemsToLoad;
      this.fetchFiles(this.venueId, this.filter.value);
    }
  }

  openConfirmModal(fileId) {
    this.visibleConfirmWindow = true;
    this.fileIdForRemove = fileId;
  }

  deleteFile() {
    this.venueFilesSubscriptions.push(this.venueService.deleteFile(this.fileIdForRemove)
      .subscribe(data => {
        const removedFileId = data['file'].id;
        this.files.forEach(file => {
          if (file.id === removedFileId) {
            this.files.splice(this.files.indexOf(file), 1);
            this.closeConfirmModal();
          }
        });
      })
    );
  }

  closeConfirmModal() {
    this.visibleConfirmWindow = false;
  }

  get noFiles () {
    return !this.searchValue && (this.filter && !this.filter.value) && !this.searchByTag && !this.files.length;
  }

  onFinishUpload(e) {
    this.skipNumber = 0;
    this.filesLoading = true;
    this.fetchFiles(this.venueId, '');
  }

  onUploadClick(files) {
    this.filesUploaddedOnClick = files;
  }

  onDrag(event) {
    this.drag = event;
  }

  ngOnDestroy () {
    this.venueFilesSubscriptions.forEach((sub) => sub.unsubscribe());
    this.filterSubscription.unsubscribe();
    this.store.set('tutorialKey', null);
  }
}
