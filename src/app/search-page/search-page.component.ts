import { Component, AfterViewChecked, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { RowFilter, ShareDataRow, DocumentListComponent } from '@alfresco/adf-content-services';
import { SearchService } from '@alfresco/adf-core';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements AfterViewChecked {

  constructor(private activatedRoute: ActivatedRoute,
              private route: Router,
              private searchService: SearchService) {

    this.nodeFilter = (row: ShareDataRow) => {
      const node = row.node.entry;

      if (node && !node.isFolder && node.content) {
          return true;
      }
      return false;
    };
  }

  @ViewChild('documentlist')
  documentlist: DocumentListComponent;

  nodeFilter: RowFilter;

  searchTerm: string;

  searchPaging: any;

  ngAfterViewChecked() {
    if (this.activatedRoute.snapshot.paramMap.get('searchTerm') !== this.searchTerm ) {
      this.searchTerm = this.activatedRoute.snapshot.paramMap.get('searchTerm');
      this.searchService.search(this.searchTerm, 50, 0).subscribe((result) => {
      this.searchPaging = result;
    });
    }
  }

  goToFolder(event: any): void {
    this.route.navigate(['/documentlist', event.value.entry.parentId]);
  }

}

