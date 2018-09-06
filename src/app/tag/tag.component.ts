import { Component, Input, EventEmitter , Output, OnInit, OnChanges } from '@angular/core';
import { TagService } from '@alfresco/adf-content-services';
import { TranslationService, NotificationService } from '@alfresco/adf-core';


@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent implements OnInit, OnChanges {

  constructor(private tagService: TagService,
              private translateService: TranslationService,
              private notificationService: NotificationService) {}

  @Input()
  nodeId;

  @Output()
  successAdd: EventEmitter<any> = new EventEmitter();

  @Output()
  error: EventEmitter<any> = new EventEmitter();

  errorMsg: string;

  newTagName: string;

  tagsEntries: any;

  ngOnInit() {
    if (this.nodeId) {
      this.tagService.getTagsByNodeId(this.nodeId).subscribe((data) => {
          this.tagsEntries = data.list.entries;
      });
    }
  }

  ngOnChanges() {
    this.cleanErrorMsg();
    if (this.nodeId) {
      this.tagService.getTagsByNodeId(this.nodeId).subscribe((data) => {
          this.tagsEntries = data.list.entries;
      });
    }
  }

  cleanErrorMsg() {
    this.errorMsg = '';
  }

  searchTag(searchTagName: string) {
    if (this.tagsEntries) {
        return this.tagsEntries.find((currentTag) => {
            return (searchTagName === currentTag.entry.tag);
        });
    }
  }

  addTag() {
    if (this.searchTag(this.newTagName)) {
        this.translateService.get('TAG.MESSAGES.EXIST').subscribe((error) => {
            this.errorMsg = error;
        });
        this.error.emit(this.errorMsg);
    } else {
        this.tagService.addTag(this.nodeId, this.newTagName).subscribe(() => {
            this.newTagName = '';
            this.successAdd.emit(this.nodeId);
            this.notificationService.openSnackMessage('Tag ajouté !');
        });
    }
  }
}
