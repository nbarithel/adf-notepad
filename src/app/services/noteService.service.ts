import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class NoteService {

  successUpload$ = new Subject<boolean>();

  uploadFolderIdSubject$ = new Subject<string>();

  noteSubject$ = new Subject<boolean>();

  constructor() {}

  createNotes(bool?: boolean): void {
    this.noteSubject$.next(bool);
  }

  success(): void {
    this.successUpload$.next();
  }
}
