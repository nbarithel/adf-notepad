import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtolViewerComponent } from './atol-viewer.component';

describe('AtolViewerComponent', () => {
  let component: AtolViewerComponent;
  let fixture: ComponentFixture<AtolViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtolViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtolViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
