import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppendixComponent } from './appendix.component';
import { ContentModule } from '@alfresco/adf-content-services';
import { CoreModule, AlfrescoApiService } from '@alfresco/adf-core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';

fdescribe('AppendixComponent', () => {
  let component: AppendixComponent;
  let fixture: ComponentFixture<AppendixComponent>;
  let alfrescoApi: AlfrescoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ContentModule,
        CoreModule
      ],
      declarations: [ AppendixComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppendixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    alfrescoApi =  TestBed.get(AlfrescoApiService);
    alfrescoApi.reset();
  });

  it('appendix component should be defined', async (() => {
    expect(component).toBeDefined();
  }));

  fdescribe('setting Node', () => {

    beforeEach(() => {
      spyOn(component, 'loadAssociations').and.callThrough();
      spyOn(alfrescoApi.getInstance().nodes, 'getNodeInfo').and.callThrough();
      component.node = {
        id : '123',
        parentId: '456'
      };
    });

    it('should call and set an upload Folder', async (() => {
      fixture.detectChanges();
      expect(component.appendixUploadFolder).toBeFalsy();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(alfrescoApi.getInstance().nodes.getNodeInfo).toHaveBeenCalled();
      });
    }));

    it('should call loadAssociation', async (() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(component.loadAssociations).toHaveBeenCalled();
      });
    }));

    it('should have adf-empty-content', () => {

    });

  });

  describe('adding associations', () => {

  });

  describe('deleting association', () => {

  });


});
