import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNotepadComponent } from './search-notepad.component';

describe('SearchNotepadComponent', () => {
  let component: SearchNotepadComponent;
  let fixture: ComponentFixture<SearchNotepadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchNotepadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNotepadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
