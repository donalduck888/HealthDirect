import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorManagementComponent } from './doctor-management.component';
import { AddDoctorComponent } from './add-doctor/add-doctor.component';
import { Route, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { DoctorQualificationComponent } from './doctor-qualification/doctor-qualification.component';
import { AddQualificationComponent } from './doctor-qualification/add-qualification/add-qualification.component';

const DoctorManagementRoute: Route[] = [
    {
        path: '',
        component: DoctorManagementComponent,

    },
    { 
        path: 'add-doctor',
        component: AddDoctorComponent, 
    },
    {
        path: 'doctor-qualification',
        component: DoctorQualificationComponent,
    },
    {
        path: 'doctor-qualification/add-qualification',
        component: AddQualificationComponent,
    },
];



@NgModule({
    declarations: [
        DoctorManagementComponent,
        AddDoctorComponent,
        DoctorQualificationComponent,
        AddQualificationComponent
    ],
    imports: [
        RouterModule.forChild(DoctorManagementRoute),
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        CommonModule,
        MatIconModule,
        MatSortModule,
        ReactiveFormsModule,
        FormsModule,
        MatSlideToggleModule,
        MatButtonModule,
        FuseAlertModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatCheckboxModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgxMaterialTimepickerModule


  ]
})
export class DoctorManagementModule { }
