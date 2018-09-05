import { Component, OnChanges, Input } from '@angular/core';
import { AlfrescoApiService, NotificationService } from '@alfresco/adf-core';
import { NodeAssocMinimalEntry, NodeAssocMinimal} from 'alfresco-js-api';

@Component({
  selector: 'app-appendix',
  templateUrl: './appendix.component.html',
  styleUrls: ['./appendix.component.scss']
})
export class AppendixComponent implements OnChanges {

  @Input()
  nodeId: string;

  associatedNodeId: string;

  isLoading: boolean;

  associatedNotes: NodeAssocMinimalEntry;

  constructor(private alfrescoApi: AlfrescoApiService,
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

  addAssociation(): void {
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
