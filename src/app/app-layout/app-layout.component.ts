import { Component, Injectable } from '@angular/core';
import { FullscreenService } from '../services/fullscreen.service';


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
export class AppLayoutComponent {

  constructor(private noteService: NoteService,
              private fullscreenService: FullscreenService) {}

  fullscreen: boolean;

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
