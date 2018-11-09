import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentsComponent } from './comments.component';
import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppTestingModule } from 'app/testing/app-testing.module';
import { CommentModel } from '@alfresco/adf-core';

fdescribe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppTestingModule,
        TranslateModule,
      ],
      declarations: [
        CommentsComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clear method test', () => {
    component.message = 'message';
    component.clear();
    expect(component.message).toBe('');
  });

  it('isATask method test', () => {
    component.taskId = 'task';
    expect(component.isATask()).toBeTruthy();
    component.taskId = '';
    expect(component.isATask()).not.toBeTruthy();
  });

  it('isANode method test', () => {
    component.nodeId = 'node';
    expect(component.isANode()).toBeTruthy();
    component.nodeId = '';
    expect(component.isANode()).not.toBeTruthy();
  });

  it('isReadOnly method test', () => {
    component.readOnly = true;
    expect(component.isReadOnly()).toBeTruthy();
    component.readOnly = false;
    expect(component.isReadOnly()).toBeFalsy();
  });

  fit('ngOnChanges  method test', () => {
    const comment = new CommentModel();
    component.comments = [comment, comment];
    component.ngOnChanges({taskId: '', nodeId: ''});
    expect(component.comments).toEqual([]);
  });

  it('add method test', () => {
  });

});
