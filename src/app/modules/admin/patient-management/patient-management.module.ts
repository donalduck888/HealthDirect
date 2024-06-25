import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientManagementComponent } from './patient-management.component';
import { Route, RouterModule } from '@angular/router';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';

const PatientManagementRoute: Route[] = [
  {
      path: '',
      component: PatientManagementComponent,
  },
  {
      path: 'add-patient',
      component: AddPatientComponent,
  },
];

@NgModule({
  declarations: [
    PatientManagementComponent,
    AddPatientComponent
  ],
  imports: [
    RouterModule.forChild(PatientManagementRoute),
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        CommonModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        MatSlideToggleModule,
        MatButtonModule,
        FuseAlertModule,
        MatCheckboxModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginatorModule,
  ]
})
export class PatientManagementModule { }
