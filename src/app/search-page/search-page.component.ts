import { Component, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { NodePaging } from '@alfresco/adf-content-services';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements DoCheck {

  constructor(private activatedRoute: ActivatedRoute,
              private route: Router) { }

  searchTerm: string;

  searchPaging: NodePaging;

  ngDoCheck() {
      this.searchTerm = this.activatedRoute.snapshot.paramMap.get('event');
    if (!this.searchTerm) {
      this.route.navigate(['/documentlist']);
    }
  }

  getSearchResult(event: NodePaging) {
    this.searchPaging = event;
  }

}

