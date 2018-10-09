import { Component, ViewChild, Input, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, NodesApiService, TranslationService, AlfrescoApiService } from '@alfresco/adf-core';
import { DocumentListComponent, RowFilter, ShareDataRow } from '@alfresco/adf-content-services';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { NoteService } from '../services/noteService.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '@alfresco/adf-content-services';
import { RenameComponent } from '../rename/rename.component';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AppendixComponent } from '../appendix/appendix.component';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-documentlist',
  templateUrl: './documentlist.component.html'
})
export class DocumentlistComponent implements OnInit, OnDestroy {

  currentFolder: MinimalNodeEntryEntity;

  @Input()
  nodeId: string = null;

  node: MinimalNodeEntryEntity;

  @ViewChild('documentList')
  documentList: DocumentListComponent;

  @ViewChild('appendix')
  appendix: AppendixComponent;

  createNote = false;

  linkAction = false;

  translatedText: string;

  notesNumber: number;

  nodeFilter: RowFilter;

  subscriptions: Subscription[] = [];

  constructor(private notificationService: NotificationService,
              private noteService: NoteService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private alfrescoApi: AlfrescoApiService,
              private nodesApiService: NodesApiService,
              private translationService: TranslationService) {}

  ngOnInit() {
    this.siteChange();
    this.subscriptions = this.subscriptions.concat([
      this.noteService.successUpload$.subscribe((next) => {
        this.success('Uploaded');
        this.documentList.reload();
      }),
      this.noteService.noteSubject$
          .subscribe((value: boolean) => {
            this.createNote = value;
            this.nodeId = '';
      }),
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
            this.siteChange();
      })
    ]);

    this.nodeFilter = (row: ShareDataRow) => {
      const node = row.node.entry;

      if (node && !node.isFolder) {
          return true;
      }
      return false;
    };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  private siteChange(): void {
    const siteId = this.route.snapshot.paramMap.get('siteId');
    const search = this.route.snapshot.paramMap.get('search');
    if (search && siteId) {
      this.alfrescoApi.getInstance().nodes
        .getNodeInfo(siteId, {
          includeSource: true,
          include: ['path', 'properties']})
        .then((node) => {
            this.currentFolder = node;
            this.nodeId = '';
            this.noteService.uploadFolderIdSubject$.next(this.currentFolder.id);
        });
    } else if (siteId) {
      this.alfrescoApi.getInstance().nodes
        .getNodeInfo('-root-', {
          includeSource: true,
          include: ['path', 'properties'],
          relativePath: '/sites/' + siteId + '/blog'
        })
        .then((node) => {
            this.currentFolder = node;
            this.nodeId = '';
            this.noteService.uploadFolderIdSubject$.next(this.currentFolder.id);
        });
    }
  }

  ready(): void {
    this.translationService.get(
      'DOCUMENT.EMPTY_CONTENT.SUBTITLE',
      {
        notesNumber: this.documentList.data.getRows().length
      }
    ).subscribe(translation => {
      this.translatedText = translation;
    });
  }

  success(action: string, event?: any, ): Promise<void> {
    if (action === 'Deleted') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
            title: this.translationService.instant('NOTIFICATION.TITLE'),
            message: this.translationService.instant('NOTIFICATION.DELETE_MESSAGE'),
            yesLabel: this.translationService.instant('NOTIFICATION.YES'),
            noLabel: this.translationService.instant('NOTIFICATION.NO')
        },
        minWidth: '250px'
      });
      return new Promise((resolve) => {
        dialogRef.beforeClose().subscribe(result => {
        if (result) {
          const id = event.value.entry.id;
          this.nodesApiService.deleteNode(id).subscribe(() => {
            if (this.appendix !== undefined ) {
              this.appendix.loadAssociations();
            }
            this.documentList.reload();
          if (id === this.nodeId ) {
            this.nodeId = null;
          }
          });
          this.notificationService.openSnackMessage(this.translationService.instant('NOTIFICATION.FILE_DELETED'));
        } else {
          this.notificationService.openSnackMessage(this.translationService.instant('NOTIFICATION.CANCEL'));
        }
        resolve();
        });
      });
    } else if (action === 'Copied') {
      this.notificationService.openSnackMessage(this.translationService.instant('NOTIFICATION.COPIED'));
    } else if (action === 'Moved') {
      this.notificationService.openSnackMessage(this.translationService.instant('NOTIFICATION.MOVED'));
    } else if (action === 'Uploaded') {
      this.notificationService.openSnackMessage(this.translationService.instant('NOTIFICATION.UPLOADED'));
    }
    this.documentList.reload();
  }

  link(): void {
    this.linkAction = true;
  }

  rename(event: any): Promise<void> {
    const dialogRef = this.dialog.open(RenameComponent, {
      data: {
        fileName: event.value.entry.name
      },
      minWidth: '250px'
    });
    return new Promise((resolve) => {
      dialogRef.beforeClose().subscribe(result => {
      if (result) {
        const newName = dialogRef.componentInstance.fileName;
        this.nodesApiService.updateNode(event.value.entry.id, { 'name': newName }).toPromise();
        this.notificationService.openSnackMessage(this.translationService.instant('NOTIFICATION.RENAMED_FILE'));
        this.documentList.reload();
      } else {
        this.notificationService.openSnackMessage(this.translationService.instant('NOTIFICATION.CANCEL'));
      }
      resolve();
      });
    });
  }

  openNode(node: MinimalNodeEntryEntity): void {
    if (node && node.id) {
      this.noteService.createNotes();
      this.setNode(node);
      this.documentList.reload();
    }
  }

  getNodeId(event): any {
    const entry = event.value.entry;
    if (entry && entry.isFile) {
      if (this.createNote) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
              title: this.translationService.instant('NOTIFICATION.TITLE'),
              message: this.translationService.instant('NOTIFICATION.QUIT_NOTE_MESSAGE'),
              yesLabel: this.translationService.instant('NOTIFICATION.YES'),
              noLabel: this.translationService.instant('NOTIFICATION.NO')
          },
          minWidth: '250px'
        });
        return new Promise((resolve) => {
          dialogRef.beforeClose().subscribe(result => {
          if (result) {
            this.noteService.createNotes();
            this.setNode(entry);
          } else {
            this.notificationService.openSnackMessage(this.translationService.instant('NOTIFICATION.NOTE_RETURN'));
          }
          resolve();
          });
        });
      } else {
        this.setNode(entry);
      }
    }
  }

  private setNode(node: MinimalNodeEntryEntity): void {
    this.node = node;
    this.nodeId = node.id;
  }

}
