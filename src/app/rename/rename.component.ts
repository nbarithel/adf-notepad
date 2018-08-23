import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-rename',
  template: `
  <h1 mat-dialog-title>{{ title }}</h1>
  <mat-dialog-content>
      <p>{{ message }}</p>
      <mat-form-field class="adf-full-width">
        <input matInput placeholder="Nom du fichier" [(ngModel)]="fileName">
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
export class RenameComponent {

  fileName: string;
  title: string;
  message: string;
  yesLabel: string;
  noLabel: string;

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    data = data || {};
    this.title = 'Renommer';
    this.message = 'Renommer le fichier ci-dessous';
    this.fileName = data.fileName;
    this.yesLabel = 'Valider';
    this.noLabel = 'Annuler';
  }
}


