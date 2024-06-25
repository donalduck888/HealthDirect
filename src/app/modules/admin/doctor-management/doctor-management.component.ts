import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; 
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Doctor, DoctorManagementPagination } from 'app/model/doctor';
import { DoctorManagementService } from 'app/services/doctor-management.service';
import moment from 'moment';
import { Subject, debounceTime, map, merge, switchMap, takeUntil, tap } from 'rxjs';


@Component({
    selector: 'app-doctor-management',
    templateUrl: './doctor-management.component.html',
    styleUrls: ['./doctor-management.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DoctorManagementComponent implements OnInit, AfterViewInit {

    users: Doctor[] = [];
    checked: boolean;
    isLoading: boolean = false;
    // pagination: DoctorManagementPagination;
    flashMessage: 'success' | 'error' | null = null;
    pagination: DoctorManagementPagination;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    displayedColumns: string[] = [
        'id',
        'login',
        'email',
        'activated',
        'createdDate',
        'lastModifiedBy',
        'lastModifiedDate',
        'authorities',
    ];
    dataSource: MatTableDataSource<Doctor>;
    // dataSource = new MatTableDataSource<Doctor>(this.users);

    @ViewChild(MatSort) sort: MatSort;
    selectedProductForm: UntypedFormGroup;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedUser: Doctor;
    private _unsubscribeAll: Subject<any> = new Subject<any>();



    constructor(private _userManagementService: DoctorManagementService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private router: Router,) { }
    ngAfterViewInit() {


    }
    ngOnInit(): void {

        this.loadAll();
        this._userManagementService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: DoctorManagementPagination) => {
                // console.log(pagination, 'pagination');
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this.selectedProductForm = this._formBuilder.group({

            id: [''],
            name: [''],
            isActive: [''],
            designation: [''],
            createdDate: [''],
            updateDate: [''],
            qualificationName: [''],
            phone: [''],
            clinicId: [''],
            monava: [''],
            tueava: [''],
            wedava: [''],
            thuava: [''],
            friava: [''],
            satava: [''],
            sunava: [''],
            monfrom: [''],
            tuefrom: [''],
            wedfrom: [''],
            thufrom: [''],
            frifrom: [''],
            satfrom: [''],
            sunfrom: [''],
            monto: [''],
            tueto: [''],
            wedto: [''],
            thuto: [''],
            frito: [''],
            satto: [''],
            sunto: [''],

        });
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._userManagementService.searchUsers(query, 0, 10);
                }),
                tap((results) => {
                    // alert(JSON.stringify(results))
                    this.users = results.body; // Update the users array with the search results
                    this.dataSource = new MatTableDataSource(this.users);
                    this.isLoading = false;
                })
            )
            .subscribe();
    }


    test() {
        this._userManagementService.test();
    }



    loadAll(page?: number, size?: number, query?: 'name') {
        this._userManagementService
            .getUsers(query, page, size)
            .subscribe((res: HttpResponse<Doctor[]>) => {
                this.users = res.body;
                this.isLoading = true;
                // console.log(this.users, ' my users');
                this.dataSource = this.dataSource = new MatTableDataSource(
                    this.users
                );
                this.isLoading = false;

            });


    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }



    createUser() { }

    toggleDetails(productId: string): void {
        // If the product is already selected...
        if (this.selectedUser && this.selectedUser.id === productId) {
            // Close the details
            this.closeDetails();
            return;
        }

        // Set the selected product
        this.selectedUser = this.users.find((u) => u.id === productId);
        this._changeDetectorRef.markForCheck();

        // Get the product by id
        this._userManagementService.getDoctorById(productId)
            .subscribe((product) => {

                // Set the selected product
                this.selectedUser = product; 
                // alert(moment(product.monfrom.toString(),'HHmm').format('HH:mm'));
                this.selectedProductForm.patchValue({
                    ...product,
                    monfrom: (moment(this.threeToFour(product.monfrom.toString()), 'HHmm').format('HH:mm')).toString(),
                    tuefrom: (moment(this.threeToFour(product.tuefrom.toString()), 'HHmm').format('HH:mm')).toString(),
                    wedfrom: (moment(this.threeToFour(product.wedfrom.toString()), 'HHmm').format('HH:mm')).toString(),
                    thufrom: (moment(this.threeToFour(product.thufrom.toString()), 'HHmm').format('HH:mm')).toString(),
                    frifrom: (moment(this.threeToFour(product.frifrom.toString()), 'HHmm').format('HH:mm')).toString(),
                    satfrom: (moment(this.threeToFour(product.satfrom.toString()), 'HHmm').format('HH:mm')).toString(),
                    sunfrom: (moment(this.threeToFour(product.sunfrom.toString()), 'HHmm').format('HH:mm')).toString(),
                    monto: (moment(this.threeToFour(product.monto.toString()), 'HHmm').format('HH:mm')).toString(),
                    tueto: (moment(this.threeToFour(product.tueto.toString()), 'HHmm').format('HH:mm')).toString(),
                    wedto: (moment(this.threeToFour(product.wedto.toString()), 'HHmm').format('HH:mm')).toString(),
                    thuto: (moment(this.threeToFour(product.thuto.toString()), 'HHmm').format('HH:mm')).toString(),
                    frito: (moment(this.threeToFour(product.frito.toString()), 'HHmm').format('HH:mm')).toString(),
                    satto: (moment(this.threeToFour(product.satto.toString()), 'HHmm').format('HH:mm')).toString(),
                    sunto: (moment(this.threeToFour(product.sunto.toString()), 'HHmm').format('HH:mm')).toString(),

                });

                this._changeDetectorRef.markForCheck();
            });
    }

    threeToFour(time: string) {
        return time.length === 3 ? '0' + time : time;
    }

    closeDetails(): void {
        this.selectedUser = null;
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {

            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    updateSelectedProduct(): void {
        const user: Doctor = {
            id: this.selectedProductForm.get('id').value,
            name: this.selectedProductForm.get('name').value,
            isActive: this.selectedProductForm.get('isActive').value,
            designation: this.selectedProductForm.get('designation').value,
            createdDate: this.selectedProductForm.get('createdDate').value,
            updatedDate: moment().toString(),
            phone: this.selectedProductForm.get('phone').value,
            clinicId: this.selectedProductForm.get('clinicId').value,
            qualificationName: this.selectedProductForm.get('qualificationName').value,
            monava: this.selectedProductForm.get('monava').value,
            tueava: this.selectedProductForm.get('tueava').value,
            wedava: this.selectedProductForm.get('wedava').value,
            thuava: this.selectedProductForm.get('thuava').value,
            friava: this.selectedProductForm.get('friava').value,
            satava: this.selectedProductForm.get('satava').value,
            sunava: this.selectedProductForm.get('sunava').value,
            monfrom: parseInt(this.selectedProductForm.get('monfrom').value.split(":").join('')),
            tuefrom: parseInt(this.selectedProductForm.get('tuefrom').value.split(":").join('')),
            wedfrom: parseInt(this.selectedProductForm.get('wedfrom').value.split(":").join('')),
            thufrom: parseInt(this.selectedProductForm.get('thufrom').value.split(":").join('')),
            frifrom: parseInt(this.selectedProductForm.get('frifrom').value.split(":").join('')),
            satfrom: parseInt(this.selectedProductForm.get('satfrom').value.split(":").join('')),
            sunfrom: parseInt(this.selectedProductForm.get('sunfrom').value.split(":").join('')),
            monto: parseInt(this.selectedProductForm.get('monto').value.split(":").join('')),
            tueto: parseInt(this.selectedProductForm.get('tueto').value.split(":").join('')),
            wedto: parseInt(this.selectedProductForm.get('wedto').value.split(":").join('')),
            thuto: parseInt(this.selectedProductForm.get('thuto').value.split(":").join('')),
            frito: parseInt(this.selectedProductForm.get('frito').value.split(":").join('')),
            satto: parseInt(this.selectedProductForm.get('satto').value.split(":").join('')),
            sunto: parseInt(this.selectedProductForm.get('sunto').value.split(":").join('')),
        };

        // Update the product on the server
        this._userManagementService.updateDoctor(this.selectedProductForm.get('id').value, user).subscribe(() => {

            // Show a success message
            this.showFlashMessage('success');
        });
    }

    onPageChange(event): void {
        this.loadAll(event.pageIndex, event.pageSize);
    }

    deleteSelectedUser(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete product',
            message: 'Are you sure you want to remove this Doctor? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {

                // Get the product object
                const product = this.selectedProductForm.getRawValue();

                // Delete the product on the server
                this._userManagementService.deleteProduct(product.id).subscribe(() => {

                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }

}