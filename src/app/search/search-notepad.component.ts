import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NodePaging, Pagination, QueryBody, MinimalNodeEntity } from 'alfresco-js-api';
import { SearchComponent } from '@alfresco/adf-content-services';
import { ThumbnailService } from '@alfresco/adf-core';
import { SearchService, SearchConfigurationService } from '@alfresco/adf-core';


@Component({
    selector: 'app-search-notepad',
    templateUrl: './search-notepad.component.html',
    styleUrls: ['./search-notepad.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SearchNotepadComponent {

    @ViewChild('search')
    search: SearchComponent;

    queryParamName = 'q';
    searchedWord = '';
    queryBodyString = '';
    errorMessage = '';
    resultNodePageList: NodePaging;
    maxItems: number;
    skipCount = 0;
    pagination: Pagination;
    queryBody: QueryBody;
    useServiceApproach = false;

    constructor(public thumbnailService: ThumbnailService,
                protected searchService: SearchService) { }

    getMimeTypeIcon(node: MinimalNodeEntity): string {
        let mimeType;

        if (node.entry.content && node.entry.content.mimeType) {
            mimeType = node.entry.content.mimeType;
        }
        if (node.entry.isFolder) {
            mimeType = 'folder';
        }

        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    generateQueryBody(searchTerm: string): QueryBody {
        if (this.useServiceApproach) {
            return null;
        } else {
            return {
                query: {
                    query: searchTerm ? `${searchTerm}* OR name:${searchTerm}*` : searchTerm
                },
                include: ['path', 'allowableOperations'],
                filterQueries: [
                    /*tslint:disable-next-line */
                    { query: "TYPE:'cm:folder' OR TYPE:'cm:content'" },
                    { query: 'NOT cm:creator:System' }]
            };
        }
        this.searchService.searchByQueryBody(this.queryBody);
    }
}