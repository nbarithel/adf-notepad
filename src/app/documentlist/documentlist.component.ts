import { Component, ViewChild, Input } from '@angular/core';
import { NotificationService } from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { PreviewService } from '../services/preview.service';
import { MinimalNodeEntity, MinimalNodeEntryEntity } from 'alfresco-js-api';

@Component({
  selector: 'app-documentlist',
  templateUrl: './documentlist.component.html',
  styleUrls: ['./documentlist.component.scss']
})
export class DocumentlistComponent {

  myStartFolder = '-my-';

  showView = true;

  showProperties = false;

  showVersions = false;

  showComments = false;

  @Input()
  nodeId: string = null;

  node: MinimalNodeEntryEntity;

  @ViewChild('documentList')
  documentList: DocumentListComponent;

  notesNumber: number;

  constructor(private notificationService: NotificationService, private preview: PreviewService) {
  }

  ready(): void {
    this.notesNumber = this.documentList.data.getRows().length;
  }

  success(event: any, action: string): void {
    this.notificationService.openSnackMessage('File ' + action);
    this.documentList.reload();
  }

  showTabs(tabName: string) {
    if (this.nodeId) {
      this.showComments = false;
      this.showProperties = false;
      this.showView = false;
      this.showVersions = false;
      switch (tabName) {
        case 'View':
          this.showView = true;
          break;
        case 'Properties':
          this.showProperties = true;
          break;
        case 'Versions':
          this.showVersions = true;
          break;
        case 'Comments':
          this.showComments = true;
          break;
      }
    }
  }

  getNodeId(event): void {
    const entry = event.value.entry;
    if (entry && entry.isFile) {
      this.nodeId = entry.id;
      this.node = entry;
    }
  }

  onGoBack(event: any) {
    this.showView = false;
    this.nodeId = null;
  }

}
