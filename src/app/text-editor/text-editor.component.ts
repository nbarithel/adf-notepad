import { Component, EventEmitter, ViewChild, Output , NgZone, Input , OnChanges, AfterViewChecked } from '@angular/core';
import { UploadService, NotificationService, FileModel, ContentService, NodesApiService, TranslationService } from '@alfresco/adf-core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '@alfresco/adf-content-services';
import { UploadFilesEvent } from '@alfresco/adf-content-services';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { TdTextEditorComponent } from '@covalent/text-editor';
import { FullscreenService } from '../services/fullscreen.service';
/* import { EditorModule } from '@tinymce/tinymce-angular'; */


@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  providers: [ UploadService ]
})

export class TextEditorComponent implements OnChanges, AfterViewChecked {

  @ViewChild('textEditor')
  tdEditor: TdTextEditorComponent;

  @Input()
  node: MinimalNodeEntryEntity;

  @Input()
  parentId: string;

  nodeId: string;

  name: string;

  @Output()
  success = new EventEmitter();

  @Output()
  closeEdit = new EventEmitter();

  newFileName: string;

  erreur: boolean;

  value: string;

  majorVersion = true;

  modifiedNote: boolean;

  options: any = {
    lineWrapping: true,
    spellChecker: false,
    toolbar: [
      'bold',
      'italic',
      'strikethrough',
      'heading',
      'heading-smaller',
      'heading-bigger',
      '|',
      'quote',
      'unordered-list',
      'ordered-list',
      'table',
      'link',
      'image',
      'code',
      '|',
      'preview',
      'side-by-side',
      'fullscreen',
      '|',
      'guide'
    ],
    placeholder: this.trans.instant('TEXT_EDITOR.TYPE'),
  };

  constructor(protected uploadService: UploadService,
              protected ngZone: NgZone,
              private http: HttpClient,
              protected contentService: ContentService,
              protected notificationService: NotificationService,
              protected dialog: MatDialog,
              private trans: TranslationService,
              protected nodesApiService: NodesApiService,
              protected fullscreenService: FullscreenService) {}

  ngOnChanges() {
    if (this.node && this.node.id) {
      if (this.nodeId) {
        const url = this.contentService.getContentUrl(this.nodeId);
        this.checkContent(url, this.node);
      } else {
        this.getIdContent(this.node);
      }
    }
  }

  private getIdContent(node: MinimalNodeEntryEntity) {
    this.nodeId = node.id;
    this.name = node.name;
    this.newFileName = this.name;
    const url = this.contentService.getContentUrl(this.nodeId);
    this.getUrlContent(url);
  }

  ngAfterViewChecked() {
    this.fullscreenService.fullscreen = this.tdEditor.isFullscreenActive();
  }

  private getUrlContent(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        this.http.get(url, { responseType: 'text' }).subscribe(res => {
            this.value = res;
            resolve();
        }, (event) => {
            reject(event);
        });
    });
  }

  private checkContent(url: string, node: MinimalNodeEntryEntity) {
    return new Promise((resolve, reject) => {
      this.http.get(url, { responseType: 'text' }).subscribe(res => {
          if (this.value !== res) {
            this.modifiedNote = true;
            this.openSaveConfirmationDialog(this.trans.instant('NOTIFICATION.MODIFICATION'));
          } else {
            this.getIdContent(node);
          }
          resolve();
      }, (event) => {
          reject(event);
      });
  });
}

  openSaveConfirmationDialog(message: string): Promise<any> {
    if (this.value && this.newFileName) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
            title: this.trans.instant('NOTIFICATION.TITLE'),
            message: message,
            yesLabel: this.trans.instant('NOTIFICATION.YES'),
            noLabel: this.trans.instant('NOTIFICATION.NO')
        },
        minWidth: '250px'
      });
      return new Promise((resolve, reject) => {
          dialogRef.beforeClose().subscribe(result => {
          if (result && this.modifiedNote) {
            this.saveTheFile();
            this.getIdContent(this.node);
          } else if (result && !this.modifiedNote) {
            this.saveTheFile();
          } else if (this.modifiedNote) {
            this.getIdContent(this.node);
          } else {
            this.notificationService.openSnackMessage(this.trans.instant('NOTIFICATION.CANCEL'));
          }
          this.modifiedNote = false;
          resolve();
        });
      });
    } else {
      this.getIdContent(this.node);
    }
  }

  private saveTheFile() {
    if (this.nodeId && this.name !== this.newFileName ) {
      this.nodesApiService.updateNode(this.nodeId, { 'name': this.newFileName }).toPromise();
      this.uploadFiles(new File([this.value], this.newFileName));
      this.success.emit();
    } else {
      const file = new File([this.value], this.newFileName);
      this.uploadFiles(file);
      this.success.emit();
    }
  }

  protected createFileModel(file: File, parentId: string, path: string, id?: string): FileModel {
    return new FileModel(file, {
        majorVersion: this.majorVersion,
        newVersion: true,
        parentId: parentId,
        path: path,
        nodeType: 'cm:content',
    }, id);
  }

  uploadFiles(file): void {
    const filteredFiles = this.createFileModel(file, this.parentId , (file.webkitRelativePath || '').replace(/\/[^\/]*$/, ''));
    this.uploadQueue(filteredFiles);
  }

  private uploadQueue(file: FileModel) {

    this.ngZone.run(() => {
          const event = new UploadFilesEvent(
              [file],
              this.uploadService
          );

          if (!event.defaultPrevented) {
                this.uploadService.addToQueue(file);
                this.uploadService.uploadFilesInTheQueue(this.success);
          }
    });
  }
}
