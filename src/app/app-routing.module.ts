import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { ParticipantsListComponent } from './participants-list/participants-list.component';
import { ParticipantFormComponent } from './participant-form/participant-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: '/participants', pathMatch: 'full' },
      { path: 'participants', component: ParticipantsListComponent },
      { path: 'participants/new', component: ParticipantFormComponent },
      { path: 'participants/:id', component: ParticipantFormComponent },
      { path: 'dashboard', component: DashboardComponent }
    ]
  },
  { path: '**', redirectTo: '/participants' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
