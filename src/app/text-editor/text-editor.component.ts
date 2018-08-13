import { Component, EventEmitter, Output , NgZone, Input , OnChanges, ViewChild } from '@angular/core';
import { UploadService, NotificationService, FileModel, ContentService } from '@alfresco/adf-core';
import { HttpClient } from '@angular/common/http';
import { UploadFilesEvent } from '@alfresco/adf-content-services';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  providers: [ UploadService ]
})

export class TextEditorComponent implements OnChanges {

  @Input()
  node: MinimalNodeEntryEntity;

  nodeId: string;

  @Output()
  success = new EventEmitter();

  @Output()
  closeEdit = new EventEmitter();

  value: string;

  options: any = {
    lineWrapping: false,
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
    placeholder: 'Type your note here...',
  };

  constructor(protected uploadService: UploadService,
              protected ngZone: NgZone,
              private http: HttpClient,
              protected contentService: ContentService,
              protected notificationService: NotificationService) {}

  ngOnChanges() {
    if (this.node && this.node.id) {
      this.nodeId = this.node.id;
      const url = this.contentService.getContentUrl(this.nodeId);
      this.getUrlContent(url);
    }
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

  saveTheFile() {
    if (this.value !== undefined) {
      let fileName: string;
      if (this.node) {
        fileName = this.node.name;
      } else {
        fileName = 'new2';
      }
      const file = new File([this.value], fileName);
      this.uploadFiles(file);
      this.success.emit();
    } else {
      this.notificationService.openSnackMessage('Note vide');
    }
  }

  protected createFileModel(file: File, parentId: string, path: string, id?: string): FileModel {
    return new FileModel(file, {
        majorVersion: true,
        newVersion: true,
        parentId: parentId,
        path: path,
        nodeType: 'cm:content',
    }, id);
  }

  uploadFiles(file): void {
    const filteredFiles = this.createFileModel(file, '-root-', (file.webkitRelativePath || '').replace(/\/[^\/]*$/, ''));
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
