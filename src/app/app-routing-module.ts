import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/participants', pathMatch: 'full' },
  { 
    path: 'participants', 
    loadChildren: () => import('./features/participants/participants.module').then(m => m.ParticipantsModule) 
  },
  { 
    path: 'dashboard', 
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) 
  },
  { path: '**', redirectTo: '/participants' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
