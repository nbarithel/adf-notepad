import { Component, ViewChild, Input } from '@angular/core';
import { NotificationService } from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { PreviewService } from '../services/preview.service';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { CommentsComponent } from '../comment/comments.component';

@Component({
  selector: 'app-documentlist',
  templateUrl: './documentlist.component.html'
})
export class DocumentlistComponent {

  myStartFolder = '-my-';

  @Input()
  nodeId: string = null;

  node: MinimalNodeEntryEntity;

  @ViewChild('documentList')
  documentList: DocumentListComponent;

  comment: CommentsComponent;

  notesNumber: number;

  commentsNumber: number;

  constructor(private notificationService: NotificationService, private preview: PreviewService) {
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
    }
  }

  onGoBack(event: any) {
    this.nodeId = null;
  }

}
