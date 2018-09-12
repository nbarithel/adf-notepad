import { Component, Injectable, AfterViewChecked } from '@angular/core';
import { FullscreenService } from '../services/fullscreen.service';
import { environment } from 'environments/environment';
/* import { Router } from '@angular/router';
import { DocumentlistComponent } from '../documentlist/documentlist.component'; */


@Injectable()
export class NoteService {

  createNote = false;

  nodeId;

  uploadFolder: string;

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

  uploadFolder = '-my-';

  production = environment.production;

  createNotes() {
    this.noteService.createNote = true;
    this.noteService.nodeId = 0;
  }

/*   createSite() {
    // créer le site avec l'api siteAPi
    // ajouter le html correspondant et la route
    const config = this.router.config;
    config.push({
      path: 'yaouen',
      component: DocumentlistComponent,
      data: { siteName: 'yaouen'
      }});
    this.router.resetConfig(config);
  } */

  ngAfterViewChecked() {
    this.uploadFolder = this.noteService.uploadFolder;
    this.fullscreen = this.fullscreenService.fullscreen;
  }

  success() {
    this.noteService.successUpload = true;
  }

}
