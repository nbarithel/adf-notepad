import { Component, EventEmitter, ViewChild, Output , NgZone, Input , OnChanges, AfterViewChecked, OnDestroy } from '@angular/core';
import { UploadService, NotificationService, FileModel, ContentService, NodesApiService, TranslationService } from '@alfresco/adf-core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '@alfresco/adf-content-services';
import { UploadFilesEvent } from '@alfresco/adf-content-services';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { TdTextEditorComponent } from '@covalent/text-editor';
import { FullscreenService } from '../services/fullscreen.service';
import { TabManagementService } from 'app/services/tab-management.service';
/* import { EditorModule } from '@tinymce/tinymce-angular'; */


@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['text-editor.component.scss'],
  providers: [ UploadService ]
})

export class TextEditorComponent implements OnChanges, AfterViewChecked, OnDestroy {

  @ViewChild('textEditor')
  tdEditor: TdTextEditorComponent;

  @Input()
  node: any;

  @Input()
  parentId: string;

  nodeId: string;

  name: string;

  @Output()
  success = new EventEmitter();

  @Output()
  openNewNote = new EventEmitter();

  newFileName: string;

  erreur: boolean;

  isLoading = false;

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
              private tabManagementService: TabManagementService,
              protected notificationService: NotificationService,
              protected dialog: MatDialog,
              private trans: TranslationService,
              protected nodesApiService: NodesApiService,
              protected fullscreenService: FullscreenService) {}

  ngOnChanges() {
    if (this.node && this.node.id) {
      this.isLoading = true;
      if (this.nodeId) {
        const url = this.contentService.getContentUrl(this.nodeId);
        this.checkContent(url, this.node);
      } else if (this.tabManagementService.previousNote.nodeId) {
        this.nodeId = this.tabManagementService.previousNote.nodeId;
        this.value = this.tabManagementService.previousNote.contentValue;
        this.newFileName = this.tabManagementService.previousNote.modifiedName;
        this.name = this.tabManagementService.previousNote.name;
        const url = this.contentService.getContentUrl(this.nodeId);
        this.checkContent(url, this.node);
      } else {
        this.getIdContent(this.node);
      }
    }
  }

  ngOnDestroy() {
    this.tabManagementService.previousNote.contentValue = this.value;
    this.tabManagementService.previousNote.modifiedName = this.newFileName;
    this.tabManagementService.previousNote.name = this.name;
  }

  getIdContent(node: any): void {
    this.nodeId = node.id;
    this.name = node.name;
    this.newFileName = this.name;
    this.tabManagementService.previousNote.nodeId = this.nodeId;
    const url = this.contentService.getContentUrl(this.nodeId);
    this.getUrlContent(url).then((res) => {
      this.value = res;
      this.tabManagementService.tabReady$.next(true);
      this.isLoading = false;
    });
  }

  ngAfterViewChecked() {
    if (this.tdEditor) {
      this.fullscreenService.isFullScreen(this.tdEditor.isFullscreenActive());
    }
  }

  private getUrlContent(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        this.http.get(url, { responseType: 'text' }).subscribe(res => {
            resolve(res);
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
          if (result && this.modifiedNote && this.name !== this.newFileName ) {
            this.saveTheFile();
          } else if (result && this.modifiedNote) {
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

  private saveTheFile(): void {
    if (this.nodeId && this.name !== this.newFileName && this.modifiedNote) {
      this.nodesApiService.updateNode(this.nodeId, { 'name': this.newFileName }).subscribe(() => {
        this.uploadFiles(new File([this.value], this.newFileName));
        this.getIdContent(this.node);
        this.success.emit();
      });
    } else if (this.nodeId && this.name !== this.newFileName ) {
      this.nodesApiService.updateNode(this.nodeId, { 'name': this.newFileName }).subscribe(() => {
        this.uploadFiles(new File([this.value], this.newFileName));
        this.success.emit();
      });
    } else {
      const file = new File([this.value], this.newFileName);
      this.uploadFiles(file);
      this.uploadService.fileUploadComplete.subscribe((result) => {
         this.openNewNote.emit(result.data.entry);
      });
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

  private uploadQueue(file: FileModel): void {

    this.ngZone.run(() => {
          const event = new UploadFilesEvent(
              [file],
              this.uploadService,
              new EventEmitter()
          );

          if (!event.defaultPrevented) {
                this.uploadService.addToQueue(file);
                this.uploadService.uploadFilesInTheQueue(this.success);
          }
    });
  }
}
