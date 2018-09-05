import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppendixComponent } from './appendix.component';

describe('AppendixComponent', () => {
  let component: AppendixComponent;
  let fixture: ComponentFixture<AppendixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppendixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppendixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
