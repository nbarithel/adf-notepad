import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

import { ContentModule } from '@alfresco/adf-content-services';
import { DocumentlistComponent } from './documentlist.component';
import { PreviewService } from '../services/preview.service';
import { AlfrescoApiServiceMock, AlfrescoApiService, CoreModule } from '@alfresco/adf-core';
import { RouterTestingModule } from '@angular/router/testing';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { InfoDrawerComponent, InfoDrawerTabComponent } from '../info-drawer-tab/info-drawer-tab.component';
import { NotepadSocialComponent } from '../notepad-social/notepad-social.component';
import { AppendixComponent } from '../appendix/appendix.component';
import { CommentsComponent } from '../comment/comments.component';
import { TagComponent } from '../tag/tag.component';
import { TdTextEditorComponent } from '@covalent/text-editor';
import { MatChipsModule, MatBadgeModule, MatDialog } from '@angular/material';
import { NoteService } from '../services/noteService.service';


describe('DocumentlistComponent', () => {
  let component: DocumentlistComponent;
  let fixture: ComponentFixture<DocumentlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatBadgeModule,
        MatChipsModule,
        ContentModule,
        CoreModule ,
        BrowserAnimationsModule
      ],
      declarations: [
        DocumentlistComponent,
        TextEditorComponent,
        InfoDrawerComponent,
        InfoDrawerTabComponent,
        NotepadSocialComponent,
        AppendixComponent,
        CommentsComponent,
        TagComponent,
        TdTextEditorComponent
      ],
      providers: [
        PreviewService,
        {provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock},
        { provide: Location, useClass: SpyLocation },
        NoteService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('Node filter should be defined' , () => {
    expect(component.nodeFilter).toBeDefined();
  });

});
