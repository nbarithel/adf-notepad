import { Component, EventEmitter, Output , NgZone } from '@angular/core';
import { UploadService, FileModel, FileInfo } from '@alfresco/adf-core';
import { UploadFilesEvent } from '@alfresco/adf-content-services';


@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  providers: [ UploadService ]
})

export class TextEditorComponent {

  value: string;

  @Output()
  success = new EventEmitter();

  constructor(protected uploadService: UploadService,
              protected ngZone: NgZone) {}

  saveTheFile() {
    const blobText = new Blob([this.value], { type: 'text/plain;charset=utf-8'});
    const file = new File([this.value], 'TESTFILEIMPORTANT');
    if (!this.value){
      this.uploadFiles(file);
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
