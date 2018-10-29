import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ContentNodeDialogService } from '@alfresco/adf-content-services';
import { AlfrescoApiService, NotificationService, UploadService } from '@alfresco/adf-core';
import { NodeAssocMinimalEntry, MinimalNodeEntryEntity } from 'alfresco-js-api';
import { TabManagementService } from '../services/tab-management.service';

@Component({
  selector: 'app-appendix',
  templateUrl: './appendix.component.html',
  styleUrls: ['./appendix.component.scss']
})
export class AppendixComponent implements OnChanges {

  @Input()
  node: MinimalNodeEntryEntity;

  @Output()
  success: EventEmitter<any> = new EventEmitter();

  nodeId: string;

  folderId: string;

  appendixNodesNumber: number;

  nodeSelector: false;

  isLoading: boolean;

  appendixNodes: NodeAssocMinimalEntry;

  constructor(private alfrescoApi: AlfrescoApiService,
              private tabManager: TabManagementService,
              private uploadService: UploadService,
              private dialogService: ContentNodeDialogService,
              private notificationService: NotificationService) { }

  ngOnChanges() {
    this.nodeId = this.node.id;
    this.folderId = this.node.parentId;
    this.loadAssociations();
   }

  loadAssociations(): void {
    this.isLoading = true;
    this.alfrescoApi.getInstance().core.associationsApi.listTargetAssociations(this.nodeId).then((data) => {
      this.appendixNodes = data.list.entries;
      this.isLoading = false;
      this.tabManager.$appendixNumber.next(data.list.pagination.count);
      this.tabManager.$tabReady.next(true);
    });
  }

  private addAssociation(annexId: string): void {
    this.alfrescoApi.getInstance().core.associationsApi
      .addAssoc(this.nodeId, { targetId: annexId, assocType: 'cm:attachments'} ).then(() => {
        this.loadAssociations();
        this.notificationService.openSnackMessage('TOOLTIP.APPENDIX.NEW_APPENDIX');
    });
  }

  deleteAssociation(appendixId: string): void {
    this.alfrescoApi.getInstance().core.associationsApi.removeAssoc(this.nodeId, appendixId)
    .then(() => {
      this.loadAssociations();
    });
  }

  nodeAssociation(): void {
    this.dialogService.openFileBrowseDialogByFolderId(this.folderId).subscribe((pick) => {
      if (pick[0].id === this.nodeId) {
        this.notificationService.openSnackMessage('Vous ne pouvez pas mettre la source en annexe');
      } else if (pick) {
        this.addAssociation(pick[0].id);
      }
    });
  }

  uploadAssociation(): void {
    this.uploadService.fileUploadComplete.subscribe((result) => {
      this.addAssociation(result.data.entry.id);
      this.success.emit();
    });
  }

}
