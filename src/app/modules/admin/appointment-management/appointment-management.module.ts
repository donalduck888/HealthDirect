import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentManagementComponent } from './appointment-management.component';
import { Route, RouterModule } from '@angular/router';
import { CalendarModule as AngularCalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CalendarService } from './calendar.service'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatNativeDateModule } from '@angular/material/core';
import { EventFormComponent } from './event-form/event-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColorPickerModule } from 'ngx-color-picker';
import { FuseConfirmDialogModule } from '@fuse/components/confirm-dialog/confirm-dialog.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS} from 'ng-pick-datetime';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCardModule} from '@angular/material/card';
import { CompleteAppointmentComponent } from './complete-appointment/complete-appointment.component';
import {MatDividerModule} from '@angular/material/divider';


const AppointmentManagementRoute: Route[] = [
  {
    path: '',
    component: AppointmentManagementComponent,
  },

];

export const MY_NATIVE_FORMATS = {
  fullPickerInput: {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'},
  datePickerInput: {year: 'numeric', month: 'numeric', day: 'numeric'},
  timePickerInput: {hour: 'numeric', minute: 'numeric'},
  monthYearLabel: {year: 'numeric', month: 'short'},
  dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
  monthYearA11yLabel: {year: 'numeric', month: 'long'},
};

@NgModule({
  providers: [CalendarService ,{provide: OWL_DATE_TIME_FORMATS, useValue: MY_NATIVE_FORMATS}],
  declarations: [AppointmentManagementComponent, EventFormComponent, CompleteAppointmentComponent],
  imports: [
    RouterModule.forChild(AppointmentManagementRoute),
    CommonModule,
    MatIconModule,  
    MatAutocompleteModule,
    OwlDateTimeModule,  
    OwlNativeDateTimeModule,  
    MatButtonModule, 
    MatFormFieldModule,
    MatInputModule,
    MatTableModule, 
    MatSortModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatCardModule,
    MatToolbarModule,  
    MatDialogModule,
    ColorPickerModule,
    FormsModule, 
    MatSlideToggleModule,
    FuseAlertModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDividerModule,
    FuseConfirmDialogModule,
    AngularCalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
  ],
  entryComponents: [
    EventFormComponent,
    CompleteAppointmentComponent
    
    
],
 
})
export class AppointmentManagementModule { } 
