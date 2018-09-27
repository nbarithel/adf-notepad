import { Component, ViewChild, Input, DoCheck, OnInit, ChangeDetectorRef } from '@angular/core';
import { NotificationService, NodesApiService, TranslationService, AlfrescoApiService } from '@alfresco/adf-core';
import { DocumentListComponent, RowFilter, ShareDataRow } from '@alfresco/adf-content-services';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { NoteService } from '../app-layout/app-layout.component';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '@alfresco/adf-content-services';
import { RenameComponent } from '../rename/rename.component';
import { ActivatedRoute } from '@angular/router';
import { AppendixComponent } from '../appendix/appendix.component';

@Component({
  selector: 'app-documentlist',
  templateUrl: './documentlist.component.html'
})
export class DocumentlistComponent implements DoCheck , OnInit {

  currentFolderId: string;

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

  constructor(private notificationService: NotificationService,
              private noteService: NoteService,
              private route: ActivatedRoute,
              private apiService: AlfrescoApiService,
              private dialog: MatDialog,
              private nodesApiService: NodesApiService,
              private changeDetector: ChangeDetectorRef,
              private translationService: TranslationService) {

    this.nodeFilter = (row: ShareDataRow) => {
      const node = row.node.entry;

      if (node && !node.isFolder) {
          return true;
      }
      return false;
    };
  }

  ngOnInit() {
    const { data } = this.route.snapshot;
    if (!data.siteName) {
      this.currentFolderId = this.route.snapshot.paramMap.get('siteId');
      if (!this.currentFolderId) {
        this.currentFolderId = '-my-';
      }
      this.noteService.uploadFolderId = this.currentFolderId;
    } else {
      const nodes: any = this.apiService.getInstance().nodes;
      nodes.getNodeInfo('-root-', {
          includeSource: true,
          include: ['path', 'properties'],
          relativePath: '/sites/' + data.siteName + '/blog'
      })
      .then(node => {
          this.currentFolderId = node.id;
          this.noteService.uploadFolderId = this.currentFolderId;
          this.changeDetector.detectChanges();
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
    if (this.noteService.nodeId === 0) {
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

  success(event: any, action: string): any {
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

  rename(event: any) {
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
            this.nodeId = entry.id;
            this.node = entry;
            this.noteService.createNote = false;
            this.noteService.nodeId = entry.id;
          } else {
            this.notificationService.openSnackMessage(this.translationService.instant('NOTIFICATION.NOTE_RETURN'));
          }
          resolve();
          });
        });
      } else {
        this.nodeId = entry.id;
        this.node = entry;
        this.noteService.createNote = false;
        this.noteService.nodeId = entry.id;
      }
    }
  }

  onGoBack(event: any) {
    this.nodeId = null;
  }

}
