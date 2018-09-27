import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentListComponent, TimeAgoPipe } from '@alfresco/adf-core';
import { CommentsComponent } from './comments.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommentProcessService, NotificationService, CommentContentService } from '@alfresco/adf-core';
import { MatButtonModule, MatListModule, MatFormFieldModule, MatInputModule, MatRippleModule } from '@angular/material';
import { By } from '@angular/platform-browser';

describe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;
  const commentProcessService = jasmine.createSpy('CommentProcessService');
  const notificationService  = jasmine.createSpy('NotificationService');
  const commentContentService  = jasmine.createSpy('CommentContentService');
  const translateService  = jasmine.createSpy('TranslateService');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
       imports: [
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,
        MatListModule
        ],
      declarations:
      [
        CommentsComponent,
        CommentListComponent,
        TranslatePipe,
        TimeAgoPipe
      ],
      providers: [
        { provide: CommentProcessService, useValue: commentProcessService },
        { provide: NotificationService , useValue: notificationService },
        { provide: CommentContentService , useValue: commentContentService },
        { provide: TranslateService, useValue: translateService }
      ]
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
});
