import { Component, ViewChild, Input, DoCheck } from '@angular/core';
import { NotificationService } from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { CommentsComponent } from '../comment/comments.component';
import { NoteService } from '../app-layout/app-layout.component';

@Component({
  selector: 'app-documentlist',
  templateUrl: './documentlist.component.html'
})
export class DocumentlistComponent implements DoCheck {

  myStartFolder = '-my-';

  @Input()
  nodeId: string = null;

  node: MinimalNodeEntryEntity;

  @ViewChild('documentList')
  documentList: DocumentListComponent;

  comment: CommentsComponent;

  createNote: boolean;

  notesNumber: number;

  commentsNumber: number;

  constructor(private notificationService: NotificationService,
              private noteService: NoteService ) {
  }

  ngDoCheck() {
    this.createNote = this.noteService.createNote;
    if (this.noteService.nodeId === 0) {
      this.nodeId = null;
    }
  }

  createNotes() {
    this.noteService.createNote = true;
  }

  ready(): void {
    this.notesNumber = this.documentList.data.getRows().length;
  }

  getCommentsNumber(event: number) {
    this.commentsNumber = event;
  }

  success(event: any, action: string): void {
    this.notificationService.openSnackMessage('File ' + action);
    this.documentList.reload();
  }

  getNodeId(event): void {
    const entry = event.value.entry;
    if (entry && entry.isFile) {
      this.nodeId = entry.id;
      this.node = entry;
      this.noteService.createNote = false;
      this.noteService.nodeId = entry.id;
    }
}

  onGoBack(event: any) {
    this.nodeId = null;
  }

}
