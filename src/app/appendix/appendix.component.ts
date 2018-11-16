import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ContentNodeDialogService, NodePaging } from '@alfresco/adf-content-services';
import { AlfrescoApiService, NotificationService, UploadService } from '@alfresco/adf-core';
import { NodeAssocMinimalEntry, MinimalNodeEntryEntity, NodeAssocPaging } from 'alfresco-js-api';
import { TabManagementService } from '../services/tab-management.service';

@Component({
  selector: 'app-appendix',
  templateUrl: './appendix.component.html',
  styleUrls: ['./appendix.component.scss']
})
export class AppendixComponent {


  @Input()
  set node(node: MinimalNodeEntryEntity) {
    this._node = node;
    this.setAppendixUploadFolder();
    this.loadAssociations();
  }

  @Output()
  success: EventEmitter<any> = new EventEmitter();

  private _node: MinimalNodeEntryEntity;

  appendixNodesNumber: number;

  appendixUploadFolder: string;

  nodeSelector: false;

  isLoading: boolean;

  appendixNodes: NodeAssocMinimalEntry;

  constructor(private alfrescoApi: AlfrescoApiService,
              private tabManagementService: TabManagementService,
              private uploadService: UploadService,
              private dialogService: ContentNodeDialogService,
              private notificationService: NotificationService) { }

  private get nodeId(): string {
    return this._node.id;
  }

  private setAppendixUploadFolder() {
    this.alfrescoApi.getInstance().nodes
    .getNodeInfo(this._node.parentId)
    .then((node) => {
      this.alfrescoApi.nodesApi.getNodeChildren(node.parentId)
      .then((nodePaging: NodePaging) => {
        const uploadFolderResult = nodePaging.list.entries
        .find( entry => entry.entry.name === 'documentLibrary');
        if (uploadFolderResult) {
          this.appendixUploadFolder = uploadFolderResult.entry.id;
        }
      });
    });
  }

  loadAssociations(): void {
    this.isLoading = true;
    this.alfrescoApi.getInstance().core.associationsApi.listTargetAssociations(this.nodeId).then((data: NodeAssocPaging) => {
      this.appendixNodes = data.list.entries;
      this.isLoading = false;
      this.tabManagementService.appendixCount$.next(data.list.pagination.count);
      this.tabManagementService.tabReady$.next(true);
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
      this.notificationService.openSnackMessage('TOOLTIP.APPENDIX.REMOVED_LINK');
    });
  }

  nodeAssociation(): void {
    this.dialogService.openFileBrowseDialogByFolderId(this._node.parentId).subscribe((pick: MinimalNodeEntryEntity[]) => {
      if (pick[0].id === this.nodeId) {
        this.notificationService.openSnackMessage('TOOLTIP.APPENDIX.SOURCE');
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
