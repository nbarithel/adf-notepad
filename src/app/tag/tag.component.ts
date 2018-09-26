import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TagService } from '@alfresco/adf-content-services';
import { TranslationService, NotificationService } from '@alfresco/adf-core';


@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent {

  constructor(private tagService: TagService,
              private translateService: TranslationService,
              private notificationService: NotificationService) {}

  @Input()
  nodeId;

  errorMsg: string;

  newTagName: string;

  addTag(): void {
    this.tagService.getTagsByNodeId(this.nodeId).subscribe((data) => {
      const existingTag = data.list.entries.find(tags => tags.entry.tag === this.newTagName);
      if (existingTag) {
        this.translateService.get('TAG.MESSAGES.EXIST').subscribe((error) => {
            this.errorMsg = error;
        });
      } else {
        this.errorMsg = '';
        this.tagService.addTag(this.nodeId, this.newTagName).subscribe(() => {
            this.newTagName = '';
            this.notificationService.openSnackMessage('Tag ajouté !');
        });
      }
    });
  }

}
