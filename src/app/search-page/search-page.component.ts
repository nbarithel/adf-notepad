import { Component, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { NodePaging, RowFilter, ShareDataRow } from '@alfresco/adf-content-services';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements DoCheck {

  constructor(private activatedRoute: ActivatedRoute,
              private route: Router) {

    this.nodeFilter = (row: ShareDataRow) => {
      const node = row.node.entry;

      if (node && !node.isFolder) {
          return true;
      }
      return false;
    };
  }

  nodeFilter: RowFilter;

  searchTerm: string;

  searchPaging: NodePaging;

  ngDoCheck() {
    this.searchTerm = this.activatedRoute.snapshot.paramMap.get('searchTerm');
  }

  getSearchResult(event: NodePaging): void {
    this.searchPaging = event;
  }

  goToFolder(event: any): void {
    this.route.navigate(['/documentlist', event.value.entry.parentId]);
  }

}

