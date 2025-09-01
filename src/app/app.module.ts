import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

// Components
import { AppComponent } from './app.component';
import { ShellComponent } from './layout/shell/shell.component';
import { ParticipantsListComponent, ConfirmDeleteDialog } from './participants-list/participants-list.component';
import { ParticipantFormComponent } from './participant-form/participant-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ShellComponent,
    ParticipantsListComponent,
    ConfirmDeleteDialog,
    ParticipantFormComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
