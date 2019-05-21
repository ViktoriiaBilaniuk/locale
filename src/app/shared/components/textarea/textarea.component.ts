import {
  Component,
  OnInit,
  Input,
  ApplicationRef,
  Output,
  ViewChild,
  ElementRef,
  Renderer2,
  EventEmitter
} from '@angular/core';
import {  } from '@angular/core/src/application_ref';
import { UtilsService } from '../../../core/services/utils/utils.service';

@Component({
  selector: 'sl-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['textarea.scss']
})
export class TextareaComponent implements OnInit {
  @Input() placeholder: string;
  @Input() value: string;
  @Input() confirmTitle: string;
  @Input() cancelTitle: string;
  @Input() required = false;

  @Output() onSave = new EventEmitter<string>();
  @Output() onCancel = new EventEmitter<any>();

  @ViewChild('mainInput') inputRef: ElementRef;

  constructor(
    private utils: UtilsService,
    private app: ApplicationRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.setupEventListeners(['cut', 'paste', 'keydown']);
  }

  onSaveClick() {
    if (this.required && !this.inputRef.nativeElement.value.trim().length) {
      this.utils.showErrorModal('This field is required');
      return;
    }
    this.onSave.emit(this.inputRef.nativeElement.value);
  }
  onCancelClick() {
    this.onCancel.emit();
  }

  private setupEventListeners(events: string[]) {
    const callback = () => {
      window.setTimeout(() => {
        this.renderer.setStyle(this.inputRef.nativeElement, 'height', `${this.inputRef.nativeElement.scrollHeight}px`);
      }, 0);
    };
    events.forEach((event) => this.renderer.listen(this.inputRef.nativeElement, event, callback));
    callback(); // triggers first time function when setting up to expand input immediately
  }
}
