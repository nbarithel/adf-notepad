/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CommentProcessService } from '@alfresco/adf-core';
import { CommentContentService } from '@alfresco/adf-core';
import { CommentModel } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html'
})
export class CommentsComponent implements OnChanges {

    /** The numeric ID of the task. */
    @Input()
    taskId: string;

    /** The numeric ID of the node. */
    @Input()
    nodeId: string;

    /** Are the comments read only? */
    @Input()
    readOnly = false;

    /** Emitted when an error occurs while displaying/adding a comment. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    commentsNumber: EventEmitter<number> = new EventEmitter<number>();

    comments: CommentModel [] = [];

    private commentObserver: Observer<CommentModel>;
    comment$: Observable<CommentModel>;

    message: string;

    beingAdded = false;

    constructor(private commentProcessService: CommentProcessService, private commentContentService: CommentContentService) {
        this.comment$ = new Observable<CommentModel>(observer => this.commentObserver = observer).share();
        this.comment$.subscribe((comment: CommentModel) => {
            this.comments.push(comment);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        this.taskId = null;
        this.nodeId = null;

        this.taskId = changes['taskId'] ? changes['taskId'].currentValue : null;
        this.nodeId = changes['nodeId'] ? changes['nodeId'].currentValue : null;

        if (this.taskId || this.nodeId) {
            this.getComments();
        } else {
            this.resetComments();
        }
    }

    private getComments(): void {
        this.resetComments();
        if (this.isATask()) {
            this.commentProcessService.getTaskComments(this.taskId).subscribe(
                (res: CommentModel[]) => {
                    if (res && res instanceof Array) {
                        res = res.sort((comment1: CommentModel, comment2: CommentModel) => {
                            const date1 = new Date(comment1.created);
                            const date2 = new Date(comment2.created);
                            return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
                        });
                        res.forEach((comment) => {
                            this.commentObserver.next(comment);
                        });
                    }

                },
                (err) => {
                    this.error.emit(err);
                }
            );
        }

        if (this.isANode()) {
            this.commentContentService.getNodeComments(this.nodeId).subscribe(
                (res: CommentModel[]) => {
                    if (res && res instanceof Array) {

                        res = res.sort((comment1: CommentModel, comment2: CommentModel) => {
                            const date1 = new Date(comment1.created);
                            const date2 = new Date(comment2.created);
                            return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
                        });
                        res.forEach((comment) => {
                            this.commentObserver.next(comment);
                        });
                    } this.commentsNumber.emit(this.comments.length);
                },
                (err) => {
                    this.error.emit(err);
                }
            );
        }
    }

    private resetComments(): void {
        this.comments = [];
    }

    add(): void {
        if (this.message && this.message.trim() && !this.beingAdded) {
            this.beingAdded = true;
            if (this.isATask()) {
                this.commentProcessService.addTaskComment(this.taskId, this.message)
                    .subscribe(
                        (res: CommentModel) => {
                            this.comments.unshift(res);
                            this.message = '';
                            this.beingAdded = false;

                        },
                        (err) => {
                            this.error.emit(err);
                            this.beingAdded = false;
                        }
                    );
            }

            if (this.isANode()) {
                this.commentContentService.addNodeComment(this.nodeId, this.message)
                    .subscribe(
                        (res: CommentModel) => {
                            this.comments.unshift(res);
                            this.message = '';
                            this.beingAdded = false;

                        },
                        (err) => {
                            this.error.emit(err);
                            this.beingAdded = false;
                        }
                    );
            }
        }
    }

    clear(): void {
        this.message = '';
    }

    isReadOnly(): boolean {
        return this.readOnly;
    }

    isATask(): boolean {
        return this.taskId ? true : false;
    }

    isANode(): boolean {
        return this.nodeId ? true : false;
    }
}