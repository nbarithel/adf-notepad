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

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardEcm, ErrorContentComponent } from '@alfresco/adf-core';
import { LoginComponent } from './login/login.component';
import { DocumentlistComponent } from './documentlist/documentlist.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { TrashcanComponent } from './trashcan/trashcan.component';
import { SearchPageComponent } from './search-page/search-page.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuardEcm],
    children: [
      {
        path: 'trashcan',
        component: TrashcanComponent,
        canActivate: [AuthGuardEcm]
      },
      {
        path: 'documentlist/:siteId',
        component: DocumentlistComponent,
        canActivate: [AuthGuardEcm]
      },
      {
        path: 'documentlist/:search/:siteId',
        component: DocumentlistComponent,
        canActivate: [AuthGuardEcm]
      },
      {
        path: 'search/:searchTerm',
        component: SearchPageComponent,
        canActivate: [ AuthGuardEcm ]
      },
      {
          path: 'error/:errorCode',
          component: ErrorContentComponent
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
