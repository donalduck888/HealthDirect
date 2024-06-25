import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Clinic, ClinicManagementPagination } from 'app/model/clinic';
import { ClinicServiceService } from 'app/services/clinic-service.service';
import { Subject, debounceTime, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-clinic-management',
  templateUrl: './clinic-management.component.html',
  styleUrls: ['./clinic-management.component.scss']
})
export class ClinicManagementComponent {

    clinics: Clinic[] = [];
    checked: boolean;
    isLoading: boolean = false;
    // pagination: DoctorManagementPagination;
    flashMessage: 'success' | 'error' | null = null;
    //pagination: DoctorManagementPagination;

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
    dataSource: MatTableDataSource<Clinic>;
    // dataSource = new MatTableDataSource<Doctor>(this.users);

    @ViewChild(MatSort) sort: MatSort;
    clinicEditForm: UntypedFormGroup;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedClinic: Clinic;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    pagination: ClinicManagementPagination;



    constructor(private _userManagementService: ClinicServiceService,
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
        .subscribe((pagination: ClinicManagementPagination) => {
            // console.log(pagination, 'pagination');
            // Update the pagination
            this.pagination = pagination;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
        this.clinicEditForm = this._formBuilder.group({
            id: [''],
            clinicName: [''],
            clinicCity: [''],
            clinicAddress: [''],
            hotline1: [''],
            hotline2: [''],
            doctorId: [''],
            createdDate: [''],
            remark: [''],
        });

    }

    test() {
        this._userManagementService.test();
    }



    loadAll(page?: number, size?: number, query?: 'clinicName') {
        this._userManagementService
        .getClinics(query, page, size)
        .subscribe((res: HttpResponse<Clinic[]>) => {
            this.clinics = res.body;
            this.isLoading = true;
            // console.log(this.users, ' my users');
            this.dataSource = this.dataSource = new MatTableDataSource(
                this.clinics
            );
            this.isLoading = false;

        });

        // this.searchInputControl.valueChanges
        //     .pipe(
        //         takeUntil(this._unsubscribeAll),
        //         debounceTime(300),
        //         switchMap((query) => {
        //             this.closeDetails();
        //             this.isLoading = true;
        //             return this._userManagementService.searchUsers(query, 0, 10);
        //         }),
        //         tap((results) => {
        //             this.clinics = results; // Update the users array with the search results
        //             this.dataSource = new MatTableDataSource(this.clinics);
        //             this.isLoading = false;
        //         })
        //     )
        //     .subscribe();
    }

    // applyFilter(event: Event) {
    //     const filterValue = (event.target as HTMLInputElement).value;
    //     this.dataSource.filter = filterValue.trim().toLowerCase();

    //     if (this.dataSource.paginator) {
    //         this.dataSource.paginator.firstPage();
    //     }
    // }



    addClinic() { }

    toggleDetails(productId: string): void {
        // If the product is already selected...
        if (this.selectedClinic && this.selectedClinic.id === productId) {
            // Close the details
            this.closeDetails();
            return;
        }

        // Set the selected product
        this.selectedClinic = this.clinics.find((u) => u.id === productId);
        this._changeDetectorRef.markForCheck();

        // Get the product by id
        this._userManagementService.getClinicById(productId)
            .subscribe((product) => {

                // Set the selected product
                this.selectedClinic = product;

                // Fill the form
                this.clinicEditForm.patchValue(product);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    closeDetails(): void {
        this.selectedClinic = null;
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
        // Get the product object
        const product = this.clinicEditForm.getRawValue();

        // Remove the currentImageIndex field
        delete product.currentImageIndex;
        // this.router.navigate(['']);

        // Update the product on the server
        this._userManagementService.updateClinic(product.id, product).subscribe(() => {



            // Show a success message
            this.showFlashMessage('success');
        });
    }

    onPageChange(event): void {
        this.loadAll(event.pageIndex, event.pageSize);
    }


    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    deleteSelectedUser(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete product',
            message: 'Are you sure you want to remove this Clinic? This action cannot be undone!',
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
                const product = this.clinicEditForm.getRawValue();

                // Delete the product on the server
                this._userManagementService.deleteProduct(product.id).subscribe(() => {

                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }

}
