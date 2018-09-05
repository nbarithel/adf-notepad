import { Component, OnChanges, Input } from '@angular/core';
import { ContentNodeDialogService } from '@alfresco/adf-content-services';
import { AlfrescoApiService, NotificationService } from '@alfresco/adf-core';
import { NodeAssocMinimalEntry } from 'alfresco-js-api';

@Component({
  selector: 'app-appendix',
  templateUrl: './appendix.component.html',
  styleUrls: ['./appendix.component.scss']
})
export class AppendixComponent implements OnChanges {

  @Input()
  nodeId: string;

  associatedNodeId: string;

  nodeSelector: false;

  isLoading: boolean;

  associatedNotes: NodeAssocMinimalEntry;

  constructor(private alfrescoApi: AlfrescoApiService,
              private dialogService: ContentNodeDialogService,
              private notificationService: NotificationService) { }

  ngOnChanges() {
    this.loadAssociations();
   }

  private loadAssociations() {
    this.isLoading = true;
    this.alfrescoApi.getInstance().core.associationsApi.listTargetAssociations(this.nodeId).then((data) => {
      this.associatedNotes = data.list.entries;
      this.isLoading = false;
    });
  }

  deleteAssociation(entry: string): void {
    this.alfrescoApi.getInstance().core.associationsApi.removeAssoc(this.nodeId, entry)
    .then(() => { this.loadAssociations();
    });
  }

  addAssociation() {
    this.dialogService.openFileBrowseDialogByFolderId('-my-').subscribe((pick) => {
      if (pick[0].id === this.nodeId) {
        this.notificationService.openSnackMessage('Vous ne pouvez pas mettre la source en annexe');
      } else if (pick) {
        this.alfrescoApi.getInstance().core.associationsApi
        .addAssoc(this.nodeId, { targetId: pick[0].id, assocType: 'cm:attachments'} ).then(() => {
          this.loadAssociations();
          this.notificationService.openSnackMessage('Nouvelle annexe');
        });
      }
    });
  }

  addUploadAssociation(): void {
    this.alfrescoApi.getInstance().nodes.getNodeChildren('-my-')
    .then(result => {
      this.associatedNodeId = result.list.entries[result.list.entries.length - 1].entry.id;
      this.alfrescoApi.getInstance().core.associationsApi
      .addAssoc(this.nodeId, { targetId: this.associatedNodeId, assocType: 'cm:attachments'} ).then(() => {
        this.loadAssociations();
        this.notificationService.openSnackMessage('Nouvelle annexe');
      });
    });
  }

}
