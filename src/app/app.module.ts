import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { PreviewService } from './services/preview.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material';
import { NoteService } from './app-layout/app-layout.component';

// ADF modules
import { AdfModule } from './adf.module';
import { ThemePickerModule } from './theme-picker/theme-picker';
import { CovalentTextEditorModule } from '@covalent/text-editor';
import { SearchModule } from '@alfresco/adf-content-services';

// App components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DocumentlistComponent } from './documentlist/documentlist.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { CommentsComponent } from './comment/comments.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { SearchNotepadComponent } from './search/search-notepad.component';



@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CovalentTextEditorModule,
    ThemePickerModule,
    MatTabsModule,
    SearchModule,
    RouterModule.forRoot(
      appRoutes // ,
      // { enableTracing: true } // <-- debugging purposes only
    ),

    // ADF modules
    AdfModule
  ],
  declarations: [
    AppComponent,
    CommentsComponent,
    HomeComponent,
    LoginComponent,
    DocumentlistComponent,
    AppLayoutComponent,
    TextEditorComponent,
    SearchNotepadComponent
  ],
  providers: [
    PreviewService,
    MatDialog,
    NoteService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
