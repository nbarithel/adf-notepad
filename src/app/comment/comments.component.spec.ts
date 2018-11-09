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
});
