import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagNodeListComponent } from './tag-node-list.component';

describe('TagNodeListComponent', () => {
  let component: TagNodeListComponent;
  let fixture: ComponentFixture<TagNodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagNodeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagNodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
