import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDrawerTabComponent } from './info-drawer-tab.component';

describe('InfoDrawerTabComponent', () => {
  let component: InfoDrawerTabComponent;
  let fixture: ComponentFixture<InfoDrawerTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoDrawerTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoDrawerTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
