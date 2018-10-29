import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import 'rxjs/add/observable/of';

@Injectable({
  providedIn: 'root'
})
export class TabManagementService {

  constructor() { }

  lastNodeId: string;

  lastNodeValue;

  lastNewNameValue;

  lastNameValue;

  $tabReady = new Subject<boolean>();

  $appendixNumber = new Subject<number>();

  $versionsNumber = new Subject<number>();

  $commentsNumber = new Subject<number>();

}
