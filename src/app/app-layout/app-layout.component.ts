import { Component, DoCheck, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { SearchControlComponent } from '@alfresco/adf-content-services';
import { FullscreenService } from '../services/fullscreen.service';
import { environment } from 'environments/environment';
import { SiteFormComponent } from '../site-form/site-form.component';
import { NoteService } from '../services/noteService.service';
import { Router } from '@angular/router';
import { AlfrescoApiService, NotificationService, TranslationService } from '@alfresco/adf-core';
import { SiteEntry, SiteBody } from 'alfresco-js-api';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements DoCheck, OnInit, OnDestroy {

  constructor(private noteService: NoteService,
              private dialog: MatDialog,
              private translationService: TranslationService,
              private notificationService: NotificationService,
              private alfrescoApi: AlfrescoApiService,
              private router: Router,
              private fullscreenService: FullscreenService) {}


  @ViewChild('searchBar')
  searchBar: SearchControlComponent;

  fullscreen = false;

  uploadFolderId = '-my-';

  searchPageOpened = false;

  sites: SiteEntry[];

  searchedWord: string;

  production = environment.production;

  subscriptions: Subscription[] = [];

  ngOnInit() {
    this.subscriptions = this.subscriptions.concat([
      this.noteService.uploadFolderIdSubject$.subscribe((uploadFolderId) => {
        this.uploadFolderId = uploadFolderId;
      }),
      this.fullscreenService.fullscreenSubject.subscribe((isFullScreen) => {
        this.fullscreen = isFullScreen;
      })
    ]);
    this.alfrescoApi.sitesApi.getSites().then((sitesResult) => {
      this.sites = sitesResult.list.entries;
    });
  }

  ngDoCheck() {
    if (this.searchBar) {
      this.manageSearchBar();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
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
        const siteId = dialogRef.componentInstance.siteId;
        const siteTitle = dialogRef.componentInstance.siteTitle;
        const visibility = dialogRef.componentInstance.visibility;
        const description = dialogRef.componentInstance.description;
        this.createSite(siteId, siteTitle, visibility, description);
        this.notificationService.openSnackMessage(this.translationService.instant('Created new Site : ' + siteTitle));
      } else {
        this.notificationService.openSnackMessage(this.translationService.instant('Cancellation'));
      }
      resolve();
      });
    });
  }

  private createSite(siteId: string, siteName: string, visibility: SiteBody.VisibilityEnum, description?: string): void {
    const body: SiteBody = {
      id: siteId,
      title: siteName,
      visibility: visibility,
      description: description
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
