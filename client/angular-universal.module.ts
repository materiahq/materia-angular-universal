import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

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
