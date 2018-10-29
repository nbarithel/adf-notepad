import { AlfrescoApiService, ContentService } from '@alfresco/adf-core';
import { Component, Input, OnChanges, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { VersionsApi, MinimalNodeEntryEntity, VersionEntry } from 'alfresco-js-api';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '@alfresco/adf-content-services';
import { TabManagementService } from 'app/services/tab-management.service';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
      'class': 'adf-version-list'
  }
})
export class VersionComponent implements OnChanges {

  private versionsApi: VersionsApi;
  versions: VersionEntry[] = [];
  isLoading = true;

  /** @deprecated in 2.3.0 */
  @Input()
  id: string;

  /** The target node. */
  @Input()
  node: MinimalNodeEntryEntity;

  /** Toggles showing/hiding of comments */
  @Input()
  showComments = true;

  /** Enable/disable downloading a version of the current node. */
  @Input()
  allowDownload = true;

  /** Toggles showing/hiding of version actions */
  @Input()
  showActions = true;

  /** Emitted when a version is restored */
  @Output()
  restored: EventEmitter<MinimalNodeEntryEntity> = new EventEmitter<MinimalNodeEntryEntity>();

  /** Emitted when a version is deleted */
  @Output()
  deleted: EventEmitter<MinimalNodeEntryEntity> = new EventEmitter<MinimalNodeEntryEntity>();

  constructor(private alfrescoApi: AlfrescoApiService,
              private contentService: ContentService,
              private tabManager: TabManagementService,
              private dialog: MatDialog) {
      this.versionsApi = this.alfrescoApi.versionsApi;
  }

  ngOnChanges() {
      this.loadVersionHistory();
  }

  canUpdate(): boolean {
      return this.contentService.hasPermission(this.node, 'update') && this.versions.length > 1;
  }

  canDelete(): boolean {
      return this.contentService.hasPermission(this.node, 'delete') && this.versions.length > 1;
  }

  restore(versionId) {
      if (this.canUpdate()) {
          this.versionsApi
              .revertVersion(this.node.id, versionId, { majorVersion: true, comment: '' })
              .then(() => this.onVersionRestored(this.node));
      }
  }

  loadVersionHistory() {
      this.isLoading = true;
      this.versionsApi.listVersionHistory(this.node.id).then((data) => {
          this.versions = data.list.entries;
          this.isLoading = false;
          this.tabManager.$tabReady.next(true);
          this.tabManager.$versionsNumber.next(data.list.pagination.count);
      });
  }

  downloadVersion(versionId: string) {
      if (this.allowDownload) {
          const versionDownloadUrl = this.getVersionContentUrl(this.node.id, versionId, true);
          this.downloadContent(versionDownloadUrl);
      }
  }

  deleteVersion(versionId: string) {
      if (this.canUpdate()) {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
              data: {
                  title: 'ADF_VERSION_LIST.CONFIRM_DELETE.TITLE',
                  message: 'ADF_VERSION_LIST.CONFIRM_DELETE.MESSAGE',
                  yesLabel: 'ADF_VERSION_LIST.CONFIRM_DELETE.YES_LABEL',
                  noLabel: 'ADF_VERSION_LIST.CONFIRM_DELETE.NO_LABEL'
              },
              minWidth: '250px'
          });

          dialogRef.afterClosed().subscribe(result => {
              if (result === true) {
                  this.alfrescoApi.versionsApi
                      .deleteVersion(this.node.id, versionId)
                      .then(() => this.onVersionDeleted(this.node));
              }
          });
      }
  }

  onVersionDeleted(node: any) {
      this.loadVersionHistory();
      this.deleted.emit(node);
  }

  onVersionRestored(node: any) {
      this.loadVersionHistory();
      this.restored.emit(node);
  }

  private getVersionContentUrl(nodeId: string, versionId: string, attachment?: boolean) {
      const nodeDownloadUrl = this.alfrescoApi.contentApi.getContentUrl(nodeId, attachment);
      return nodeDownloadUrl.replace('/content', '/versions/' + versionId + '/content');
  }

  downloadContent(url: string) {
      if (url) {
          const link = document.createElement('a');

          link.style.display = 'none';
          link.href = url;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  }
}