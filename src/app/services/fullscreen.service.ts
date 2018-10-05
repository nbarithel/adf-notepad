import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class FullscreenService {

  fullscreenSubject = new Subject<any>();

  constructor() { }

  isFullScreen(bool?: boolean): void {
    this.fullscreenSubject.next(bool);
  }

}
