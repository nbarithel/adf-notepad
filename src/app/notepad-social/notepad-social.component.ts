import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { TabManagementService } from 'app/services/tab-management.service';

@Component({
  selector: 'app-notepad-social',
  templateUrl: './notepad-social.component.html',
  styleUrls: ['./notepad-social.component.scss']
})
export class NotepadSocialComponent implements OnChanges {

  @Input()
  nodeId;

  constructor(private tabManager: TabManagementService) {}

  ngOnChanges() {
    this.tabManager.$tabReady.next(true);
  }

}

