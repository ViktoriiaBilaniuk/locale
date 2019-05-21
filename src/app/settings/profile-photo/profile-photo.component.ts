import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '../../core/store/store';
import { UserService } from '../../core/services/user/user.service';
import { UtilsService } from '../../core/services/utils/utils.service';
import { TrackingSerivce } from './../../core/services/tracking/tracking.service';
import { filter } from 'rxjs/internal/operators';

@Component({
  selector: 'sl-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.scss']
})
export class ProfilePhotoComponent implements OnInit {
  @ViewChild('fileInput') fileInput;
  public avatarUrl: string;
  private maxFileSize = 5;
  private mimeTypes = ['image/png', 'image/jpeg', 'image/bmp'];
  public error: string;
  public localImageStyle: any;
  public showLocalCover: boolean;

  constructor(
    private store: Store,
    private userService: UserService,
    private utils: UtilsService,
    private track: TrackingSerivce) { }

  ngOnInit() {
    this.store.select('current-user')
      .pipe(
        filter((user: any) => user)
      )
      .subscribe((user: any) => {
        this.avatarUrl = user.image;
      });
  }

  get file () {
    return this.fileInput.nativeElement.files.length ?
      this.fileInput.nativeElement.files[0] :
      null;
  }

  get isValid () {
    return !this.file || (this.validType && this.validSize);
  }

  get validSize () {
    return ((this.file.size / 1024) / 1024) < this.maxFileSize;
  }

  get validType () {
    return this.mimeTypes.indexOf(this.file.type) !== -1;
  }

  fileChange () {
    if (!this.isValid) {
      return;
    }
    this.error = '';
    this.uploadFile();
    this.readFile();
    this.track.userDataWasEdited(['avatar']);
  }

  uploadFile () {
    this.userService.getPreSignedUrl({
        file_name: this.file.name,
        file_type: this.file.type
      })
      .subscribe(this.postFile.bind(this));
  }

  postFile (res) {
    const {file_url, signed_request } = res.data;
    this.avatarUrl = file_url;
    this.userService.uploadProfilePhoto(signed_request, this.fileInput.nativeElement.files[0])
      .subscribe(this.updateUser.bind(this));
  }

  updateUser () {
    this.userService.updateUser({ image: this.avatarUrl })
      .subscribe(() => {
        this.clearFile();
        this.showModal();
      });
  }

  setCoverImage(src) {
    this.localImageStyle = {'background-image': `url(${src})`};
    this.showLocalCover = true;
  }

  readFile () {
    const file = this.file;
    const reader = new FileReader();
    reader.onload = (e: any) => this.setCoverImage(e.target.result);
    reader.readAsDataURL(file);
  }

  clearFile () {
    this.fileInput.nativeElement.value = '';
  }

  showModal () {
    this.utils.showInfoModal('Settings.modalTitle', 'Settings.modalText');
  }
}
