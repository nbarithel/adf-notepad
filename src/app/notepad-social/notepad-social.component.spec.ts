import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotepadSocialComponent } from './notepad-social.component';

describe('NotepadSocialComponent', () => {
  let component: NotepadSocialComponent;
  let fixture: ComponentFixture<NotepadSocialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotepadSocialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotepadSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
