import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabManagementService {

  constructor() { }

  previousNote = {
    nodeId: '',
    contentValue: '',
    modifiedName: '',
    name: ''
  };

  tabReady$ = new Subject<boolean>();

  appendixCount$ = new Subject<number>();

  versionsCount$ = new Subject<number>();

  commentsCount$ = new Subject<number>();

}
