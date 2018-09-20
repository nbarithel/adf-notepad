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
import { AuthGuardEcm } from '@alfresco/adf-core';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DocumentlistComponent } from './documentlist/documentlist.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { TrashcanComponent } from './trashcan/trashcan.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuardEcm],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'yaouen',
        component: DocumentlistComponent,
        data: {
          siteName: 'yaouen'
        },
        canActivate: [AuthGuardEcm],
      },
      {
        path: 'nicolas',
        component: DocumentlistComponent,
        data: {
          siteName: 'nicolas'
        },
        canActivate: [AuthGuardEcm],
      },
      { path: 'trashcan',
      component: TrashcanComponent,
      canActivate: [AuthGuardEcm],
      },
      {
        path: 'documentlist',
        component: DocumentlistComponent,
        canActivate: [AuthGuardEcm],
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
