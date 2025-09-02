import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// import { BaseChartDirective } from 'ng2-charts';

import { MaterialModule } from '../../shared/material.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    // BaseChartDirective, // Will add when component is created
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }
