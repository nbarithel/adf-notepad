import { Component, Injectable } from '@angular/core';
import { TranslationService, AuthenticationService } from '@alfresco/adf-core';
import { Router } from '@angular/router';


@Injectable()
export class NoteService {

  createNote = false;
  nodeId;

  constructor() {
  }

}

@Component({
  selector: 'app-root',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {

  constructor(private noteService: NoteService) {}

  createNotes() {
    this.noteService.createNote = true;
    this.noteService.nodeId = 0;
  }

}
