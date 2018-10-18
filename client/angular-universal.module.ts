import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';

import {
  MatButtonModule,
  MatRippleModule,
  MatSnackBarModule,
  MatCardModule,
  MatIconModule,
  MatDialogModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatToolbarModule
} from '@angular/material';

import { Addon } from '@materia/addons';

import { AngularUniversalViewComponent } from './angular-universal-view/angular-universal-view.component';
import { OverviewComponent } from './components/overview/overview.component';

@Addon('@materia/angular-universal')
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatToolbarModule
  ],
  declarations: [AngularUniversalViewComponent, OverviewComponent],
  exports: [AngularUniversalViewComponent]
})
export class AngularUniversalModule {}
