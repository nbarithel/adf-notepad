/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
    TranslationService,
    TranslationMock,
    AuthenticationService,
    UserPreferencesService,
    AppConfigService,
    StorageService,
    AlfrescoApiService,
    LogService,
    NotificationService,
    NodesApiService,
    ContentService,
    ThumbnailService,
    UploadService,
    AlfrescoApiMock,
    CoreModule
} from '@alfresco/adf-core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import {
    CustomResourcesService,
    DocumentListService,
    ContentModule
} from '@alfresco/adf-content-services';
import { FullscreenService } from 'app/services/fullscreen.service';
import { NoteService } from 'app/services/noteService.service';
import { TabManagementService } from 'app/services/tab-management.service';

@NgModule({
    imports: [
        NoopAnimationsModule,
        HttpClientModule,
        RouterTestingModule,
        CoreModule,
        ContentModule
    ],
    exports: [
        RouterTestingModule
    ],
    providers: [
        { provide: AlfrescoApiService, useClass: AlfrescoApiMock },
        { provide: TranslationService, useClass: TranslationMock },
        {
            provide: AuthenticationService,
            useValue: {
                isEcmLoggedIn(): boolean {
                    return true;
                },
                getRedirect(): string {
                    return null;
                }
            }
        },
        FullscreenService,
        NoteService,
        TabManagementService,
        UserPreferencesService,
        AppConfigService,
        StorageService,
        AlfrescoApiService,
        LogService,
        NotificationService,
        NodesApiService,
        ContentService,
        ThumbnailService,
        UploadService,
        CustomResourcesService,
        DocumentListService
    ]
})
export class AppTestingModule {}
