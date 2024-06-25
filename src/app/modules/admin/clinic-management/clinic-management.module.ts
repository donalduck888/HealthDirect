import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicManagementComponent } from './clinic-management.component';
import { Route, RouterModule } from '@angular/router';
import { AddClinicComponent } from './add-clinic/add-clinic.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FuseAlertModule } from '@fuse/components/alert';

const ClinicManagementRoute: Route[] = [
    {
        path: '',
        component: ClinicManagementComponent,
    },

    {
        path: 'add-clinic',
        component: AddClinicComponent,
    },

];



@NgModule({
    declarations: [
        ClinicManagementComponent,
        AddClinicComponent
    ],

    imports: [
        RouterModule.forChild(ClinicManagementRoute),
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
    ]
})

export class ClinicManagementModule { }
