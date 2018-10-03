import { Component, DoCheck, ViewChild } from '@angular/core';
import { SearchControlComponent } from '@alfresco/adf-content-services';
import { FullscreenService } from '../services/fullscreen.service';
import { environment } from 'environments/environment';
import { NoteService } from '../services/noteService.service';
import { Router } from '@angular/router';


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

  searchPageOpened = false;

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
    if (searchInput && this.searchPageOpened) {
      this.router.navigate(['/search', searchInput]);
      this.searchedWord = searchInput;
    }
  }

  searchPageOpen(searchInput: any) {
    if (searchInput.target.value) {
      this.router.navigate(['/search', searchInput.target.value]);
      this.searchedWord = searchInput.target.value;
      this.searchPageOpened = true;
      this.searchBar.liveSearchMaxResults = 0;
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
      this.searchPageOpened = false;
      this.searchBar.liveSearchMaxResults = 10;
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
