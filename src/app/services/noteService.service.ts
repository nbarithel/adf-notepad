import { Injectable } from '@angular/core';

@Injectable()
export class NoteService {

  createNote = false;

  nodeId;

  uploadFolderId = '-my-';

  successUpload = false;

  constructor() { }

  createNotes() {
    this.createNote = true;
    this.nodeId = null;
  }

  success() {
    this.successUpload = true;
  }
}
