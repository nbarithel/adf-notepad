import { Component, DoCheck, ViewChild, OnInit } from '@angular/core';
import { SearchControlComponent } from '@alfresco/adf-content-services';
import { FullscreenService } from '../services/fullscreen.service';
import { environment } from 'environments/environment';
import { SiteFormComponent } from '../site-form/site-form.component';
import { NoteService } from '../services/noteService.service';
import { Router } from '@angular/router';
import { AlfrescoApiService, NotificationService, TranslationService } from '@alfresco/adf-core';
import { SiteEntry, SiteBody } from 'alfresco-js-api';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements DoCheck, OnInit {

  constructor(private noteService: NoteService,
              private dialog: MatDialog,
              private translationService: TranslationService,
              private notificationService: NotificationService,
              private alfrescoApi: AlfrescoApiService,
              private router: Router,
              private fullscreenService: FullscreenService) {}


  @ViewChild('searchBar')
  searchBar: SearchControlComponent;

  fullscreen: boolean;

  uploadFolderId: string;

  searchPageOpened = false;

  sites: SiteEntry[];

  searchedWord: string;

  production = environment.production;

  ngOnInit() {
    this.alfrescoApi.sitesApi.getSites().then((sitesResult) => {
      this.sites = sitesResult.list.entries;
    });
  }

  ngDoCheck() {
    this.fullscreen = this.fullscreenService.fullscreen;
    this.uploadFolderId = this.noteService.uploadFolderId;
    if (this.searchBar) {
      this.manageSearchBar();
    }
  }

  navigateToSite(siteId: String): void {
    this.router.navigate(['/documentlist', siteId]);
  }

  onItemClicked(event: any): void {
    this.router.navigate(['/documentlist', event.entry.parentId]);
  }

  loadSearchPage(searchInput: any): void {
    if (searchInput && this.searchPageOpened) {
      this.router.navigate(['/search', searchInput]);
      this.searchedWord = searchInput;
    }
  }

  searchPageOpen(searchInput: any): void {
    if (searchInput.target.value) {
      this.router.navigate(['/search', searchInput.target.value]);
      this.searchedWord = searchInput.target.value;
      this.searchPageOpened = true;
      this.searchBar.liveSearchMaxResults = 0;
    }
  }

  private manageSearchBar(): void {
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

  nameSite(): Promise<void> {
    const dialogRef = this.dialog.open(SiteFormComponent, {
      data: {
        siteName: ''
      },
      minWidth: '250px'
    });
    return new Promise((resolve) => {
      dialogRef.beforeClose().subscribe(result => {
      if (result) {
        const siteName = dialogRef.componentInstance.siteName;
        this.createSite(siteName);
        this.notificationService.openSnackMessage(this.translationService.instant('Created new Site : ' + siteName));
      } else {
        this.notificationService.openSnackMessage(this.translationService.instant('Cancellation'));
      }
      resolve();
      });
    });
  }

  private createSite(siteName: string): void {
    const body: SiteBody = {
      title: siteName,
      visibility: SiteBody.VisibilityEnum.PUBLIC
    };

    const opts = {
      'skipConfiguration': false,
      'skipAddToFavorites': false,
    };

    this.alfrescoApi.sitesApi.createSite(body, opts).then((result) => {
        this.sites.push(result);
    });
  }

}
