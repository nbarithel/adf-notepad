import { Component, ViewChild, Input, DoCheck, OnInit, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-documentlist',
  templateUrl: './documentlist.component.html'
})
export class DocumentlistComponent implements DoCheck, OnInit, OnDestroy {

  currentFolder: MinimalNodeEntryEntity;

  @Input()
  nodeId: string = null;

  node: MinimalNodeEntryEntity;

  @ViewChild('documentList')
  documentList: DocumentListComponent;

  @ViewChild('appendix')
  appendix: AppendixComponent;

  createNote: boolean;

  linkAction = false;

  translatedText: string;

  notesNumber: number;

  nodeFilter: RowFilter;

  routeSubscription: any;

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
    this.routeSubscription = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
            this.siteChange();
    });

    this.nodeFilter = (row: ShareDataRow) => {
      const node = row.node.entry;

      if (node && !node.isFolder) {
          return true;
      }
      return false;
    };
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  private siteChange(): void {
    const siteTitle = this.route.snapshot.paramMap.get('siteId');
    if (siteTitle) {
      this.alfrescoApi.getInstance().nodes
        .getNodeInfo('-root-', {
          includeSource: true,
          include: ['path', 'properties'],
          relativePath: '/sites/' + siteTitle + '/blog'
      })
        .then((node) => {
          this.currentFolder = node;
          this.nodeId = '';
          this.noteService.uploadFolderId = this.currentFolder.id;
      });
    }
  }

  ngDoCheck() {
    this.translationService.get(
      'DOCUMENT.EMPTY_CONTENT.SUBTITLE',
      {
        notesNumber: this.notesNumber
      }
    ).subscribe(translation => {
      this.translatedText = translation;
    });
    this.createNote = this.noteService.createNote;
    if (this.noteService.nodeId == null) {
      this.nodeId = null;
    } else if (this.noteService.successUpload) {
      this.documentList.reload();
      this.noteService.successUpload = false;
    }
  }

  createNotes(): void {
    this.noteService.createNote = true;
  }

  ready(): void {
    this.notesNumber = this.documentList.data.getRows().length;
  }

  success(event: any, action: string): Promise<void> {
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
      this.setNode(node);
      this.documentList.reload();
    }
  }

  getNodeId(event): any {
    const entry = event.value.entry;
    if (entry && entry.isFile) {
      if (this.noteService.createNote) {
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
    this.noteService.createNote = false;
    this.noteService.nodeId = node.id;
  }

}
