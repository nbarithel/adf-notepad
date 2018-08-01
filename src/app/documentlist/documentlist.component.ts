import { Component, ViewChild, Input } from '@angular/core';
import { NotificationService } from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { PreviewService } from '../services/preview.service';
import { MinimalNodeEntity } from 'alfresco-js-api';

@Component({
  selector: 'app-documentlist',
  templateUrl: './documentlist.component.html',
  styleUrls: ['./documentlist.component.scss']
})
export class DocumentlistComponent {

  myStartFolder: string = '-my-';

  @Input()
  showViewer: boolean = false;
  nodeId: string = null;

  @ViewChild('documentList')
  documentList: DocumentListComponent;

  constructor(private notificationService: NotificationService, private preview: PreviewService) {

  }

  success(event: any, action: string): void {
    this.notificationService.openSnackMessage("File " + action);
    this.documentList.reload();
  }

  getNodeId(event) {
    const entry = event.value.entry;
    if (entry && entry.isFile) {
      this.nodeId = entry.id;
    }
  }

  onGoBack(event: any) {
    this.showViewer = false;
    this.nodeId = null;
  }

}
