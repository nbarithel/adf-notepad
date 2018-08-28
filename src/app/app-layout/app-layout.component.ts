import { Component, Injectable, AfterViewChecked } from '@angular/core';
import { FullscreenService } from '../services/fullscreen.service';
import { environment } from 'environments/environment';


@Injectable()
export class NoteService {

  createNote = false;

  nodeId;

  successUpload = false;

  constructor() {
  }

}

@Component({
  selector: 'app-root',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements AfterViewChecked {

  constructor(private noteService: NoteService,
              private fullscreenService: FullscreenService) {}

  fullscreen = false;

  production = environment.production;

  createNotes() {
    this.noteService.createNote = true;
    this.noteService.nodeId = 0;
  }

  ngAfterViewChecked() {
    this.fullscreen = this.fullscreenService.fullscreen;
  }

  onSuccess() {
    this.noteService.successUpload = true;
  }

}
