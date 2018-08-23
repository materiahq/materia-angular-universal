import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import {
  MatButtonModule,
  MatRippleModule,
  MatSnackBarModule,
  MatCardModule,
  MatIconModule,
  MatDialogModule,
  MatInputModule
} from '@angular/material';

import { Addon } from '@materia/addons';

import { AngularUniversalViewComponent } from './angular-universal-view/angular-universal-view.component';

@Addon('@materia/angular-universal')
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    FlexLayoutModule
  ],
  declarations: [AngularUniversalViewComponent],
  exports: [AngularUniversalViewComponent]
})
export class AngularUniversalModule {}
