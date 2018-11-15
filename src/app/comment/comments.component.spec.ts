import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CommentProcessService, TranslationService, NotificationService } from '@alfresco/adf-core';
import { CommentsComponent } from './comments.component';
import { CommentContentService } from '@alfresco/adf-core';
import { AppTestingModule } from '../testing/app-testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { not } from '@angular/compiler/src/output/output_ast';

fdescribe('CommentsComponent', () => {

    let component: CommentsComponent;
    let fixture: ComponentFixture<CommentsComponent>;
    let getProcessCommentsSpy: jasmine.Spy;
    let addContentCommentSpy: jasmine.Spy;
    let getContentCommentsSpy: jasmine.Spy;
    let commentProcessService: CommentProcessService;
    let commentContentService: CommentContentService;
    let translationService: TranslationService;
    let notificationService: NotificationService;

    beforeEach(() => {
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
        fixture = TestBed.createComponent(CommentsComponent);
        component = fixture.componentInstance;

        commentProcessService = fixture.debugElement.injector.get(CommentProcessService);
        commentContentService = fixture.debugElement.injector.get(CommentContentService);
        translationService = fixture.debugElement.injector.get(TranslationService);
        notificationService = fixture.debugElement.injector.get(NotificationService);


        addContentCommentSpy = spyOn(commentContentService, 'addNodeComment').and.returnValue(of({
            id: 123,
            message: 'Test Comment',
            createdBy: {id: '999'}
        }));

        getContentCommentsSpy = spyOn(commentContentService, 'getNodeComments').and.returnValue(of([
            {message: 'Test1', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'}},
            {message: 'Test2', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'}},
            {message: 'Test3', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'}}
        ]));

        getProcessCommentsSpy = spyOn(commentProcessService, 'getTaskComments').and.returnValue(of([
            {message: 'Test1', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'}},
            {message: 'Test2', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'}},
            {message: 'Test3', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'}}
        ]));
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should load comments when taskId specified', () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});

        expect(getProcessCommentsSpy).toHaveBeenCalled();
    });

    it('should load comments when nodeId specified', () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'nodeId': change});

        expect(getContentCommentsSpy).toHaveBeenCalled();
    });

    it('should emit an error when an error occurs loading comments', () => {
        const emitSpy = spyOn(component.error, 'emit');
        getProcessCommentsSpy.and.returnValue(throwError({}));

        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});

        expect(emitSpy).toHaveBeenCalled();
    });

    it('should not load comments when no taskId is specified', () => {
        fixture.detectChanges();
        expect(getProcessCommentsSpy).not.toHaveBeenCalled();
    });

    it('should display comments count when the task has comments', async(() => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const element = fixture.nativeElement.querySelector('#comment-header');
            expect(element.innerText).toBe('COMMENTS.HEADER');
        });
    }));

    it('should not display comments when the task has no comments', async(() => {
        component.taskId = '123';
        getProcessCommentsSpy.and.returnValue(of([]));
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('#comment-container')).toBeNull();
        });
    }));

    it('should display comments input by default', async(() => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('#comment-input')).not.toBeNull();
        });
    }));

    it('should not display comments input when the task is readonly', async(() => {
        component.readOnly = true;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('#comment-input')).toBeNull();
        });
    }));

    describe('change detection taskId', () => {

        const change = new SimpleChange('123', '456', true);
        const nullChange = new SimpleChange('123', null, true);

        beforeEach(async(() => {
            component.taskId = '123';
            fixture.detectChanges();
        }));

        it('should fetch new comments when taskId changed', () => {
            component.ngOnChanges({'taskId': change});
            expect(getProcessCommentsSpy).toHaveBeenCalledWith('456');
        });

        it('should not fetch new comments when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getProcessCommentsSpy).not.toHaveBeenCalled();
        });

        it('should not fetch new comments when taskId changed to null', () => {
            expect(component.taskId).toBe('123');
            component.ngOnChanges({'taskId': nullChange});
            expect(getProcessCommentsSpy).not.toHaveBeenCalled();
        });
    });

    describe('change detection node', () => {

        const change = new SimpleChange('123', '456', true);
        const nullChange = new SimpleChange('123', null, true);

        beforeEach(async(() => {
            component.nodeId = '123';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                getContentCommentsSpy.calls.reset();
            });
        }));

        it('should fetch new comments when nodeId changed', () => {
            component.ngOnChanges({'nodeId': change});
            expect(getContentCommentsSpy).toHaveBeenCalledWith('456');
        });

        it('should not fetch new comments when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getContentCommentsSpy).not.toHaveBeenCalled();
        });

        it('should not fetch new comments when nodeId changed to null', () => {
            expect(component.nodeId).toBe('123');
            component.ngOnChanges({'nodeId': nullChange});
            expect(getContentCommentsSpy).not.toHaveBeenCalled();
        });
    });

    describe('Add comment node', () => {

        beforeEach(async(() => {
            component.nodeId = '123';
            spyOn(translationService, 'instant');
            spyOn(notificationService, 'openSnackMessage');
            fixture.detectChanges();
            fixture.whenStable();
        }));

        it('should call service to add a comment when enter key is pressed', () => {
            spyOn(component, 'add').and.callThrough(); // Espionne la méthode Add et en crée un "mock" du composant,
            // callThrough permet de ne pas changer le déroulement de la fonction, celle ci fonctionne encore malgrè ce spy.
            component.message = 'Test Comment';
            fixture.detectChanges();
            const element = fixture.nativeElement.querySelector('#comment-input'); // "Attrape" l'élement input de comment
            const event = new KeyboardEvent('keyup', {'key': 'Enter'}); // créer un event keyboard
            element.dispatchEvent(event); // envoie un Event à l'élement spécifié (appelle la fonction add)
            expect(component.add).toHaveBeenCalled();
            expect(addContentCommentSpy).toHaveBeenCalledWith('123', 'Test Comment');
            expect(component.comments.length).toBe(1);
            expect(component.comments[0].message).toBe('Test Comment');
            // on peut faire des returnValue() et des callFake(fn) pour les stubs de spies
        });

        it('should normalize comment when user input contains spaces sequence', () => {
            const element = fixture.nativeElement.querySelector('#comment-input');
            component.message = 'text     comment';
            const event = new KeyboardEvent('keyup', {'key': 'Enter'}); // créer un event keyboard
            element.dispatchEvent(event);
            expect(addContentCommentSpy).not.toHaveBeenCalledWith('123', 'text comment');
        });

        it('should call notificationService to show a notification when comment is added', async(() => {
            const element = fixture.nativeElement.querySelector('#comment-input');
            component.message = 'text comment';
            const event = new KeyboardEvent('keyup', {'key': 'Enter'});
            element.dispatchEvent(event);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(addContentCommentSpy).toHaveBeenCalledWith('123', 'text comment');
                expect(notificationService.openSnackMessage).toHaveBeenCalled();
                expect(translationService.instant).toHaveBeenCalledWith('NOTIFICATION.COMMENT_ADDED');
            });
        }));

        it('should not call services to add a comment when comment is empty', () => {
            const element = fixture.nativeElement.querySelector('#comment-input');
            component.message = '';
            const event = new KeyboardEvent('keyup', {'key': 'Enter'}); // créer un event keyboard
            element.dispatchEvent(event);
            expect(addContentCommentSpy).not.toHaveBeenCalled();
            expect(translationService.instant).not.toHaveBeenCalled();
            expect(notificationService.openSnackMessage).not.toHaveBeenCalled();
        });

        it('should clear comment when escape key is pressed', async(() => {
            const event = new KeyboardEvent('keyup', {'key': 'Escape'});
            const element = fixture.nativeElement.querySelector('#comment-input');
            element.dispatchEvent(event);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.value).toBe('');
            });
        }));

        it('should emit an error when an error occurs adding the comment', () => {
            const emitSpy = spyOn(component.error, 'emit');
            addContentCommentSpy.and.returnValue(throwError({}));
            component.message = 'Test comment';
            component.add();
            expect(emitSpy).toHaveBeenCalled();
        });

    });

});
