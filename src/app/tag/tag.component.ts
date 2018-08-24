import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html'
})
export class TagComponent {

  constructor() { }

  @Input()
  nodeId;

}
