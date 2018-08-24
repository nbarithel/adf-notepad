import { Component, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-info-drawer-tab',
  template: '<ng-template><ng-content></ng-content></ng-template>'
})
export class InfoDrawerTabComponent {
    /** The title of the tab. */
    @Input()
    label: string = '';

    /** Icon to render for the tab. */
    @Input()
    icon: string = null;

    @Input()
    badge: number;

    @ViewChild(TemplateRef)
    content: TemplateRef<any>;
}

@Component({
    selector: 'app-info-drawer',
    templateUrl: './info-drawer.component.html',
    styleUrls: ['./info-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'app-info-drawer' }
})
export class InfoDrawerComponent {
    /** The title of the info drawer. */
    @Input()
    title: string|null = null;

    /** The selected index tab. */
    @Input()
    selectedIndex: number = 0;

    /** Emitted when the currently active tab changes. */
    @Output()
    currentTab: EventEmitter<number> = new EventEmitter<number>();

    @ContentChildren(InfoDrawerTabComponent)
    contentBlocks: QueryList<InfoDrawerTabComponent>;

    showTabLayout(): boolean {
        return this.contentBlocks.length > 0;
    }

    onTabChange(event: MatTabChangeEvent) {
        this.currentTab.emit(event.index);
    }
}
