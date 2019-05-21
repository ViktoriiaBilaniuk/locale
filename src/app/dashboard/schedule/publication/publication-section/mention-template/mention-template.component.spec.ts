import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentionTemplateComponent } from './mention-template.component';

describe('MentionTemplateComponent', () => {
  let component: MentionTemplateComponent;
  let fixture: ComponentFixture<MentionTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentionTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentionTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
