import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppendixComponent } from './appendix.component';
import { ContentModule } from '@alfresco/adf-content-services';
import { CoreModule } from '@alfresco/adf-core';

describe('AppendixComponent', () => {
  let component: AppendixComponent;
  let fixture: ComponentFixture<AppendixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ContentModule,
        CoreModule
      ],
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
