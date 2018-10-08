import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TranslationService } from '@alfresco/adf-core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-site-form',
  template: `
  <h1 mat-dialog-title>{{ title }}</h1>
  <mat-dialog-content>
      <p>{{ message }}</p>
      <mat-form-field hintLabel="Max 15 characters">
        <input matInput #input1 maxlength="15" placeholder="Nom du site" [(ngModel)]="siteTitle" [formControl]="siteControl" required>
        <mat-hint align="end">{{input1.value?.length || 0}}/15</mat-hint>
        <mat-error *ngIf="siteControl.hasError('required')">Please give a title for your site</mat-error>
      </mat-form-field>
      <br/>
      <br/>
      <mat-form-field hintLabel="Max 15 characters">
        <input matInput #input2 maxlength="15" placeholder="Id du site" [(ngModel)]="siteId" [formControl]="idControl" required>
        <mat-hint align="end">{{input2.value?.length || 0}}/15</mat-hint>
        <mat-error *ngIf="idControl.hasError('required')">Please give an id</mat-error>
      </mat-form-field>
      <br/>
      <mat-form-field>
        <mat-select placeholder="Visibility" [(value)]="visibility" [formControl]="visibilityControl" required>
          <mat-option value="PUBLIC">Public</mat-option>
          <mat-option value="PRIVATE">Private</mat-option>
          <mat-option value="MODERATED">Moderated</mat-option>
        </mat-select>
        <mat-error *ngIf="visibilityControl.hasError('required')">Please choose a visibility</mat-error>
      </mat-form-field>
      <mat-form-field class="adf-full-width">
        <input matInput #input3 maxlength="140" placeholder="Description" [(ngModel)]="description">
        <mat-hint align="end">{{input3.value?.length || 0}}/140</mat-hint>
      </mat-form-field>
  </mat-dialog-content>
  <mat-dialog-actions>
      <span class="spacer"></span>
      <button id="adf-confirm-accept" mat-button color="primary" [mat-dialog-close]="true">{{ yesLabel }}</button>
      <button id="adf-confirm-cancel" mat-button [mat-dialog-close]="false" cdkFocusInitial>{{ noLabel }}</button>
  </mat-dialog-actions>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }

    .adf-confirm-dialog .mat-dialog-actions .mat-button-wrapper {
        text-transform: uppercase;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class SiteFormComponent {

  siteTitle: string;
  description: string;
  siteId: string;
  visibility: string;

  siteControl = new FormControl('', [Validators.required]);
  idControl = new FormControl('', [Validators.required]);
  visibilityControl = new FormControl('', [Validators.required]);

  title: string;
  message: string;
  yesLabel: string;
  noLabel: string;

  constructor(private translationService: TranslationService,
    @Inject(MAT_DIALOG_DATA) data) {
    data = data || {};
    this.title = this.translationService.instant('NOTIFICATION.NEW_SITE'),
    this.message = this.translationService.instant('NOTIFICATION.SITENAME_MESSAGE'),
    this.siteTitle = data.siteTitle;
    this.siteId = data.siteId;
    this.description = data.description;
    this.visibility = data.visibility;
    this.yesLabel = this.translationService.instant('NOTIFICATION.VALID'),
    this.noLabel = this.translationService.instant('NOTIFICATION.INVALID');
  }
}
