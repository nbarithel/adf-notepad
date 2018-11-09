import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TextEditorComponent } from './text-editor.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppTestingModule } from 'app/testing/app-testing.module';
import { ContentService } from '@alfresco/adf-core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FullscreenService } from 'app/services/fullscreen.service';
import { TabManagementService } from 'app/services/tab-management.service';

describe('TextEditorComponent', () => {
  let component: TextEditorComponent;
  let fixture: ComponentFixture<TextEditorComponent>;
  let contentService: ContentService;
  let fullscreenService: FullscreenService;
  let tabManagementService: TabManagementService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppTestingModule,
        TranslateModule,
        HttpClientModule,
        HttpClientTestingModule
      ],
      declarations: [
        TextEditorComponent,
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextEditorComponent);
    component = fixture.componentInstance;
    spyOn(component, 'ngAfterViewChecked');

    tabManagementService = TestBed.get(TabManagementService);
    contentService = TestBed.get(ContentService);
    fullscreenService = TestBed.get(FullscreenService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const node = { id: 'node-id' };
    component.node = node;

    expect(component.isLoading).toBeFalsy();
  });

  it('ngOnChanges test' , () => {
    spyOn(component, 'getIdContent');
    spyOn(contentService, 'getContentUrl').and.returnValue('url');

    const node = { id: 'node-id' };
    component.node = node;

    component.ngOnChanges();
    expect(component.getIdContent).toHaveBeenCalled();

    tabManagementService.lastNodeId = 'node-id';
    tabManagementService.lastNodeValue = 'lastNodeValue';
    tabManagementService.lastNewNameValue = 'lastNewNameValue';
    tabManagementService.lastNameValue = 'name';
    component.ngOnChanges();
    expect(component.value).toBe('lastNodeValue');
    expect(component.name).toBe('name');
    expect(component.newFileName).toBe('lastNewNameValue');
    expect(component.nodeId).toBe('node-id');
    expect(contentService.getContentUrl).toHaveBeenCalledWith('node-id');

    component.nodeId = node.id;
    component.ngOnChanges();
    expect(component.getIdContent).toHaveBeenCalledWith(node);
  });

  it('get IdContent test', () => {
    spyOn(component, 'getIdContent').and.callThrough();
    spyOn(contentService, 'getContentUrl').and.returnValue('url');

    const node = {
     id: 'node-id',
     name: 'node-name',
     newFileName: 'newFileName'
    };
    component.node = node;

    component.getIdContent(node);

    expect(component.getIdContent).toHaveBeenCalledWith(node);

    expect(component.nodeId).toEqual(node.id);
    expect(component.name).toEqual(node.name);
    expect(component.newFileName).not.toEqual(node.newFileName);
    expect(component.newFileName).toEqual(node.name);

  });

  it('ngAfterViewCheck test', () => {
    spyOn(fullscreenService, 'isFullScreen');

    component.ngAfterViewChecked();
    expect(fullscreenService.isFullScreen).not.toHaveBeenCalled();
  });

  it('ngOndestroy() test', () => {

    component.newFileName = 'newFileName';
    component.name = 'name';
    component.value = 'value';

    component.ngOnDestroy();

    expect(tabManagementService.lastNodeValue).toBe('value');
    expect(tabManagementService.lastNewNameValue).toBe('newFileName');
    expect(tabManagementService.lastNameValue).toBe('name');
  });

  it('openSaveConfirmationDialog test', () => {
    spyOn(component, 'getIdContent');

    component.openSaveConfirmationDialog('test');
    expect(component.getIdContent).toHaveBeenCalled();

/*     component.newFileName = 'newFileName';
    component.name = 'newFileName';
    component.value = 'value';
    component.modifiedNote = false;
    component.openSaveConfirmationDialog('test'); */

  });

});
