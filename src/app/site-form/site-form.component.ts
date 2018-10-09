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
      <mat-form-field hintLabel="{{ 'SITE_CREATION.HINT_LABEL15' | translate }}">
        <input matInput #input2 maxlength="15" placeholder="{{ 'SITE_CREATION.ID_PLACEHOLDER' | translate }}"
        [(ngModel)]="siteId" [formControl]="idControl" required>
        <mat-hint align="end">{{input2.value?.length || 0}}/15</mat-hint>
        <mat-error *ngIf="idControl.hasError('required')">{{ 'SITE_CREATION.ID_ERROR' | translate }}</mat-error>
      </mat-form-field>
      <br/>
      <br/>
      <mat-form-field hintLabel="{{ 'SITE_CREATION.HINT_LABEL120' | translate }}">
        <input matInput #input1 maxlength="120" placeholder="{{ 'SITE_CREATION.TITLE_PLACEHOLDER' | translate }}"
        [(ngModel)]="siteTitle" [formControl]="siteControl" required>
        <mat-hint align="end">{{input1.value?.length || 0}}/120</mat-hint>
        <mat-error *ngIf="siteControl.hasError('required')">{{ 'SITE_CREATION.TITLE_ERROR' | translate }}</mat-error>
      </mat-form-field>
      <br/>
      <br/>
      <mat-form-field>
        <mat-select placeholder="{{ 'SITE_CREATION.VISIBILITY_PLACEHOLDER' | translate }}"
         [(value)]="visibility" [formControl]="visibilityControl" required>
          <mat-option value="PUBLIC">{{ 'SITE_CREATION.VISIBILITY_PUBLIC' | translate }}</mat-option>
          <mat-option value="PRIVATE">{{ 'SITE_CREATION.VISIBILITY_PRIVATE' | translate }}</mat-option>
          <mat-option value="MODERATED">{{ 'SITE_CREATION.VISIBILITY_MODERATED' | translate }}</mat-option>
        </mat-select>
        <mat-error *ngIf="visibilityControl.hasError('required')">{{ 'SITE_CREATION.VISIBILITY_ERROR' | translate }}</mat-error>
      </mat-form-field>
      <mat-form-field class="adf-full-width" appearance="outline">
        <mat-label>{{ 'SITE_CREATION.DESC_PLACEHOLDER' | translate }}</mat-label>
        <textarea matInput #input3 maxlength="400" [(ngModel)]="description"></textarea>
        <mat-hint align="end">{{input3.value?.length || 0}}/400</mat-hint>
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
