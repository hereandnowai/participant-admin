import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from '../../shared/material.module';
import { ParticipantsListComponent } from './components/participants-list/participants-list.component';
import { ParticipantFormComponent } from './components/participant-form/participant-form.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

const routes: Routes = [
  { path: '', component: ParticipantsListComponent },
  { path: 'new', component: ParticipantFormComponent },
  { path: ':id', component: ParticipantFormComponent }
];

@NgModule({
  declarations: [
    ParticipantsListComponent,
    ParticipantFormComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class ParticipantsModule { }
