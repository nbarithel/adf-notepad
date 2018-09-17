import { Component, Injectable, DoCheck } from '@angular/core';
import { FullscreenService } from '../services/fullscreen.service';
import { environment } from 'environments/environment';
/* import { Router } from '@angular/router';
import { DocumentlistComponent } from '../documentlist/documentlist.component'; */


@Injectable()
export class NoteService {

  createNote = false;

  nodeId;

  uploadFolderId = '-my-';

  successUpload = false;

  constructor() { }

  createNotes() {
    this.createNote = true;
    this.nodeId = 0;
  }

  success() {
    this.successUpload = true;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements DoCheck {

  constructor(private noteService: NoteService,
              private fullscreenService: FullscreenService) {}

  fullscreen: boolean;

  uploadFolderId: string;

  production = environment.production;

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

  ngDoCheck() {
    this.fullscreen = this.fullscreenService.fullscreen;
    this.uploadFolderId = this.noteService.uploadFolderId;
  }

}
