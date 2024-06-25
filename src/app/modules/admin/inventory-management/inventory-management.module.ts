import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { ProductManagementComponent } from './product-management/product-management.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { AddProductComponent } from './product-management/add-product/add-product.component';
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
import { SupplierManagementComponent } from './supplier-management/supplier-management.component';
import { AddSupplierComponent } from './supplier-management/add-supplier/add-supplier.component';


const InventoryManagementRoute: Route[] = [
    {
        path: '',
        component: ProductManagementComponent,
    },
    {
        path: 'add-product',
        component: AddProductComponent,
    },

    {
        path: 'supplier-management',
        component: SupplierManagementComponent,
    },

    {
        path: 'supplier-management/add-supplier',
        component: AddSupplierComponent,
    },

];


@NgModule({
    declarations: [
        ProductManagementComponent,
        OrderManagementComponent,
        AddProductComponent,
        SupplierManagementComponent,
        AddSupplierComponent
    ],

    imports: [
        RouterModule.forChild(InventoryManagementRoute),
        CommonModule,

        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
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
export class InventoryManagementModule { }
