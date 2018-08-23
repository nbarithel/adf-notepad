import { Component, ViewChild, Input, DoCheck } from '@angular/core';
import { NotificationService, NodesApiService } from '@alfresco/adf-core';
import { DocumentListComponent, RowFilter, ShareDataRow } from '@alfresco/adf-content-services';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { CommentsComponent } from '../comment/comments.component';
import { NoteService } from '../app-layout/app-layout.component';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '@alfresco/adf-content-services';
import { RenameComponent } from '../rename/rename.component';

@Component({
  selector: 'app-documentlist',
  templateUrl: './documentlist.component.html'
})
export class DocumentlistComponent implements DoCheck {

  myStartFolder = '-my-';

  @Input()
  nodeId: string = null;

  node: MinimalNodeEntryEntity;

  @ViewChild('documentList')
  documentList: DocumentListComponent;

  comment: CommentsComponent;

  createNote: boolean;

  notesNumber: number;

  commentsNumber: number;

  fileFilter: RowFilter;

  constructor(private notificationService: NotificationService,
              private noteService: NoteService,
              private dialog: MatDialog,
              private nodesApiService: NodesApiService) {

    this.fileFilter = (row: ShareDataRow) => {
      let node = row.node.entry;

      if (node && !node.isFolder) {
          return true;
      }
      return false;
    };
  }

  ngDoCheck() {
    this.createNote = this.noteService.createNote;
    if (this.noteService.nodeId === 0) {
      this.nodeId = null;
    } else if (this.noteService.successUpload) {
      this.documentList.reload();
      this.noteService.successUpload = false;
    }
  }

  createNotes() {
    this.noteService.createNote = true;
  }

  ready(): void {
    this.notesNumber = this.documentList.data.getRows().length;
  }

  getCommentsNumber(event: number) {
    this.commentsNumber = event;
  }

  success(event: any, action: string): any {
    if(action == 'Deleted'){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
            title: 'Confirmation',
            message: 'Voulez vous vraiment effacer ce fichier ?',
            yesLabel: 'Oui',
            noLabel: 'Non'
        },
        minWidth: '250px'
      });
      return new Promise((resolve) => {
        dialogRef.beforeClose().subscribe(result => {
        if (result) {
          const id = event.value.entry.id;
          this.nodesApiService.deleteNode(id).subscribe(result => {
            this.documentList.reload();
          if (id == this.nodeId ) {
            this.nodeId = null;
          }
          });
          this.notificationService.openSnackMessage('File ' + action);
        } else {
          this.notificationService.openSnackMessage('Message non supprimé');
        }
        resolve();
        });
      });
    } else {
      this.notificationService.openSnackMessage('File ' + action);
    }
    this.documentList.reload();
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
        this.documentList.reload();
      } else {
        this.notificationService.openSnackMessage('Annulation')
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
              title: 'Confirmation',
              message: 'Voulez vous quittez la création de note ?',
              yesLabel: 'Oui',
              noLabel: 'Non'
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
            this.notificationService.openSnackMessage('Retour à la création de note');
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
