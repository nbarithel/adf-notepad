import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { DocumentListComponent, SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { Pagination, NodePaging } from 'alfresco-js-api';
import { Subscription } from 'rxjs';
import { PageTitleService, TranslationService } from '@alfresco/adf-core';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit, OnDestroy {

  @ViewChild('documentlist')
  documentlist: DocumentListComponent;

  sorting;

  searchTerm: string;

  searchPaging: any;

  isLoading: boolean;

  queryParamName = 'q';

  totalResults = 0;

  subscriptions: Subscription[] = [];

    constructor(private activatedRoute: ActivatedRoute,
                private titleService: PageTitleService,
                private queryBuilder: SearchQueryBuilderService,
                private translationService: TranslationService,
                private route: Router) {

    queryBuilder.paging = {
      skipCount: 0,
      maxItems: 25
    };
  }

  ngOnInit() {
    this.titleService.setTitle(this.translationService.instant('SEARCH.TITLE') + ' - AtolCD Notepad');

    this.sorting = this.getSorting();

    this.subscriptions.push(
      this.queryBuilder.updated.subscribe(() => {
          this.sorting = this.getSorting();
          this.isLoading = true;
      }),

      this.queryBuilder.executed.subscribe(data => {
          this.onSearchResultLoaded(data);
          this.isLoading = false;
      })
  );

      if (this.activatedRoute) {
          this.activatedRoute.params.forEach((params: Params) => {
              this.searchTerm = params['searchTerm'];
              const query = this.formatSearchQuery(this.searchTerm);

              if (query) {
                  this.queryBuilder.userQuery = query;
                  this.queryBuilder.update();
              } else {
                  this.queryBuilder.userQuery = null;
                  this.queryBuilder.executed.next( {list: { pagination: { totalItems: 0 }, entries: []}} );
              }
          });
      }
  }

  private formatSearchQuery(userInput: string) {
    if (!userInput) {
        return null;
    }

    const suffix = userInput.lastIndexOf('*') >= 0 ? '' : '*';
    const query = `${userInput}${suffix} OR name:${userInput}${suffix}`;

    return query;
  }

  private getSorting(): string[] {
    const primary = this.queryBuilder.getPrimarySorting();

    if (primary) {
        return [primary.key, primary.ascending ? 'asc' : 'desc'];
    }

    return ['name', 'asc'];
}

  onSearchResultLoaded(nodePaging: NodePaging): void {
    this.searchPaging = nodePaging;
    this.totalResults = nodePaging.list.pagination.count;
  }

  onPaginationChanged(pagination: Pagination): void {
    this.queryBuilder.paging = {
        maxItems: pagination.maxItems,
        skipCount: pagination.skipCount
    };
    this.queryBuilder.update();
  }

  goToFolder(event: any): void {
    this.route.navigate(['/documentlist', 'search', event.value.entry.parentId]);
  }

  ngOnDestroy() {
    this.queryBuilder.resetToDefaults();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

}
