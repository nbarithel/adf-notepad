import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AlfrescoApiService, AlfrescoApiServiceMock, CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { AppLayoutComponent, NoteService } from './app-layout.component';
import { ThemePickerModule } from '../theme-picker/theme-picker';
import { FullscreenService } from '../services/fullscreen.service';

fdescribe('AppLayoutComponent', () => {
  let component: AppLayoutComponent;
  let fixture: ComponentFixture<AppLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CoreModule.forRoot(),
        ContentModule.forRoot(),
        BrowserAnimationsModule,
        ThemePickerModule
      ],
      declarations: [AppLayoutComponent],
      providers: [
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        NoteService,
        FullscreenService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
