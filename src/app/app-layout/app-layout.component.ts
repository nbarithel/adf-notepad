import { Component, Injectable, DoCheck, ViewChild } from '@angular/core';
import { SearchControlComponent } from '@alfresco/adf-content-services';
import { FullscreenService } from '../services/fullscreen.service';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';


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
              private router: Router,
              private fullscreenService: FullscreenService) {}


  @ViewChild('searchBar')
  searchBar: SearchControlComponent;

  fullscreen: boolean;

  uploadFolderId: string;

  searchedWord: string;

  production = environment.production;

  ngDoCheck() {
    this.fullscreen = this.fullscreenService.fullscreen;
    this.uploadFolderId = this.noteService.uploadFolderId;
    if (this.searchBar) {
      this.manageSearchBar();
    }
  }

  onItemClicked(event: any) {
    this.router.navigate(['/documentlist', event.entry.parentId]);
  }

  loadSearchPage(searchInput: any) {
    if (searchInput.target.value) {
      this.router.navigate(['/search', searchInput.target.value]);
      this.searchedWord = searchInput.target.value;
    }
  }

  private manageSearchBar() {
    if (((this.router.url === '/search/' + this.searchedWord) || (this.router.url === '/search/'))
     && (this.searchBar.subscriptAnimationState === 'inactive')) {
      this.searchBar.subscriptAnimationState = 'active';
      this.searchBar.searchTerm = this.searchedWord;
    } else if (this.searchedWord && !((this.router.url === '/search/' + this.searchedWord)
      || (this.router.url === '/search/'))) {
      this.searchBar.subscriptAnimationState = 'inactive';
      this.searchedWord = '';
      this.searchBar.searchTerm = this.searchedWord;
    }
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

}
