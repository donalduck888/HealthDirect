import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { UserMangementService } from './userManagement.service';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user/add-user.component';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatSelectModule } from '@angular/material/select';

const UserManagementRoute: Route[] = [
    {
        path: '',
        component: UserManagementComponent,
    },
    {
        path: 'add-user', 
        component: AddUserComponent,
    },
];

@NgModule({
    declarations: [UserManagementComponent, AddUserComponent], 
    imports: [
        RouterModule.forChild(UserManagementRoute),
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
    ],
})
export class UserManagementModule {}
