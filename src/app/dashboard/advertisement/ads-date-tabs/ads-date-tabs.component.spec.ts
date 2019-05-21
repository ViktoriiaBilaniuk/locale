import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsDateTabsComponent } from './ads-date-tabs.component';

describe('AdsDateTabsComponent', () => {
  let component: AdsDateTabsComponent;
  let fixture: ComponentFixture<AdsDateTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsDateTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsDateTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
