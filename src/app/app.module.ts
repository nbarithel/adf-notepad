import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material';
import { NoteService } from './app-layout/app-layout.component';
import { FullscreenService } from './services/fullscreen.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';


// ADF modules
import { ThemePickerModule } from './theme-picker/theme-picker';
import { CovalentTextEditorModule } from '@covalent/text-editor';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule, SearchModule  } from '@alfresco/adf-content-services';

// App components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DocumentlistComponent } from './documentlist/documentlist.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { CommentsComponent } from './comment/comments.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { SearchNotepadComponent } from './search/search-notepad.component';
import { NotepadSocialComponent } from './notepad-social/notepad-social.component';
import { RenameComponent } from './rename/rename.component';
import { TagComponent } from './tag/tag.component';
import { InfoDrawerTabComponent, InfoDrawerComponent } from './info-drawer-tab/info-drawer-tab.component';



@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CovalentTextEditorModule,
    ThemePickerModule,
    MatTabsModule,
    MatChipsModule,
    MatBadgeModule,
    SearchModule,
    RouterModule.forRoot(
      appRoutes // ,
      // { enableTracing: true } // <-- debugging purposes only
    ),

    // ADF modules
    CoreModule.forRoot(),
    ContentModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    CommentsComponent,
    HomeComponent,
    LoginComponent,
    DocumentlistComponent,
    AppLayoutComponent,
    TextEditorComponent,
    SearchNotepadComponent,
    NotepadSocialComponent,
    RenameComponent,
    TagComponent,
    InfoDrawerTabComponent,
    InfoDrawerComponent,
  ],
  providers: [
    FullscreenService,
    MatDialog,
    NoteService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    RenameComponent
  ]
})
export class AppModule {
}
