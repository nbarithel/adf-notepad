import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notepad-social',
  templateUrl: './notepad-social.component.html',
  styleUrls: ['./notepad-social.component.scss']
})
export class NotepadSocialComponent {

  @Input()
  nodeId;

  constructor() {}

}

