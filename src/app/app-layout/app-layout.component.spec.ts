import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Directive, Input, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AlfrescoApiService, AlfrescoApiServiceMock, CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { AppLayoutComponent, NoteService } from './app-layout.component';
import { ThemePickerModule } from '../theme-picker/theme-picker';
import { FullscreenService } from '../services/fullscreen.service';
import { By } from '@angular/platform-browser';

/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
export const ButtonClickEvents = {
  left:  { button: 0 },
  right: { button: 2 }
};

@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('AppLayoutComponent', () => {
  let component: AppLayoutComponent;
  let fixture: ComponentFixture<AppLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CoreModule.forRoot(),
        ContentModule.forRoot(),
        BrowserAnimationsModule,
        ThemePickerModule
      ],
      declarations: [
        AppLayoutComponent,
        RouterLinkDirectiveStub
      ],
      providers: [
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        NoteService,
        FullscreenService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define adf-sidenav-layout', () => {
    const sidenavLayout = fixture.nativeElement.querySelector('adf-sidenav-layout');
    expect(sidenavLayout).toBeTruthy();
  });

  it('init fullScreen should be false', () => {
    expect(component.fullscreen).toBeFalsy();
  });

  it('init uploadFolderId should be my', () => {
    expect(component.uploadFolderId).toBe('-my-');
  });

  it('production should be defined', () => {
    expect(component.production).toBeDefined();
  });

  it('should be ADF-Notepad', () => {
    const h1: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('ADF-Notepad');
  });

  it('can get RouterLinks from template', () => {
    const linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
    const routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
    expect(routerLinks.length).toBe(3, 'should have 3 routerLinks');
    expect(routerLinks[0].linkParams).toBe('/documentlist');
    expect(routerLinks[1].linkParams).toBe('/yaouen');
    expect(routerLinks[2].linkParams).toBe('/nicolas');
  });

  it('can click sites', () => {
    const linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
    const routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));;

    expect(routerLinks[1].navigatedTo).toBeNull('should not have navigated yet');
    linkDes[1].triggerEventHandler('click', ButtonClickEvents.left);
    fixture.detectChanges();
    expect(routerLinks[1].navigatedTo).toBe('/yaouen');

    expect(routerLinks[0].navigatedTo).toBeNull('should not have navigated yet');
    linkDes[0].triggerEventHandler('click', ButtonClickEvents.left);
    fixture.detectChanges();
    expect(routerLinks[0].navigatedTo).toBe('/documentlist');

    expect(routerLinks[2].navigatedTo).toBeNull('should not have navigated yet');
    linkDes[2].triggerEventHandler('click', ButtonClickEvents.left);
    fixture.detectChanges();
    expect(routerLinks[2].navigatedTo).toBe('/nicolas');

  });


});
