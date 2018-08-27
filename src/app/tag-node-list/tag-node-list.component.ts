import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { TagService } from '@alfresco/adf-content-services';
import { AlfrescoApiService } from '@alfresco/adf-core';

@Component({
    selector: 'app-tag-node-list',
    templateUrl: './tag-node-list.component.html',
    encapsulation: ViewEncapsulation.None
})
export class TagNodeListComponent implements OnChanges {
    /** The identifier of a node. */
    @Input()
    nodeId: string;

    tagsEntries: any;

    /** Emitted when a tag is selected. */
    @Output()
    results = new EventEmitter();

    constructor(private tagService: TagService,
                private apiService: AlfrescoApiService) {
        this.tagService.refresh.subscribe(() => {
            this.refreshTag();
        });
    }

    ngOnChanges() {
        return this.refreshTag();
    }

    refreshTag() {
        if (this.nodeId) {
            const entriz = this.apiService.getInstance().core.tagsApi.getNodeTags(this.nodeId);
            this.tagsEntries = entriz.catch(result => {
                this.tagsEntries = result.list.entries;
                const oui = this.tagsEntries.name;
                alert(oui);
            });
        }
    }

    removeTag(tag: string) {
        this.tagService.removeTag(this.nodeId, tag).subscribe(() => {
            this.refreshTag();
        });
    }
}
