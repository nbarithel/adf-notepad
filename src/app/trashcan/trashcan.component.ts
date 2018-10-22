import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent, DocumentListComponent} from '@alfresco/adf-content-services';
import { TranslationService, NodesApiService, NotificationService, PageTitleService } from '@alfresco/adf-core';


@Component({
  selector: 'app-trashcan',
  templateUrl: './trashcan.component.html',
  styleUrls: ['trashcan.component.scss'],
})
export class TrashcanComponent {

  @ViewChild('documentList')
  documentList: DocumentListComponent;

  constructor(private nodesApiService: NodesApiService,
              private translationService: TranslationService,
              private titleService: PageTitleService,
              private notificationService: NotificationService,
              private dialog: MatDialog) {
                this.titleService.setTitle(this.translationService.instant('TRASHCAN.TITLE') + ' - AtolCD Notepad');
              }

  restore(event: any): Promise<any> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
          title: this.translationService.instant('NOTIFICATION.TITLE'),
          message: this.translationService.instant('NOTIFICATION.RESTORE_MESSAGE'),
          yesLabel: this.translationService.instant('NOTIFICATION.YES'),
          noLabel: this.translationService.instant('NOTIFICATION.NO')
      },
      minWidth: '250px'
    });
    return new Promise((resolve) => {
      dialogRef.beforeClose().subscribe(result => {
      if (result) {
        this.nodesApiService.restoreNode(event.value.entry.id).subscribe(() => {
           this.documentList.reload();
        });
        this.notificationService.openSnackMessage(this.translationService.instant('NOTIFICATION.FILE_RESTORED'));
      } else {
        this.notificationService.openSnackMessage(this.translationService.instant('NOTIFICATION.CANCEL'));
      }
      resolve();
      });
    });
  }

  delete(event: any): Promise<any> {
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
        this.nodesApiService.restoreNode(event.value.entry.id).subscribe(() => {
          this.nodesApiService.deleteNode(event.value.entry.id, {'permanent': true}).subscribe(() => {
            this.documentList.reload();
         });
       });
        this.notificationService.openSnackMessage(this.translationService.instant('NOTIFICATION.FILE_PERM_DELETED'));
      } else {
        this.notificationService.openSnackMessage(this.translationService.instant('NOTIFICATION.CANCEL'));
      }
      resolve();
      });
    });
   }

}
