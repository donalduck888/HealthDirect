import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Patient, PatientManagementPagination } from 'app/model/patient';
import { PatientManagementService } from 'app/services/patient-service.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-patient-management',
  templateUrl: './patient-management.component.html',
  styleUrls: ['./patient-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PatientManagementComponent {

    users: Patient[] = [];
    checked: boolean;
    isLoading = true;
    flashMessage: 'success' | 'error' | null = null;

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
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
    dataSource: MatTableDataSource<Patient>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selectedProductForm: UntypedFormGroup;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    pagination: PatientManagementPagination;
    selectedUser: Patient;

    constructor(private _userManagementService: PatientManagementService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,) { }

    ngOnInit(): void {

        this.loadAll();
        this._userManagementService.pagination$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((pagination: PatientManagementPagination) => {
            // console.log(pagination, 'pagination');
            // Update the pagination
            this.pagination = pagination;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        this.selectedProductForm = this._formBuilder.group({
            id: [''],
            patientName: [''],
            state: [''],
            dob: [''],
            address: [''],
            active:[''],
            phoneNo: [''],
            city:[''],
            contactPerson: [''],

        });
    }

    test() {
        this._userManagementService.test();
    }

    // async loadAll() {
    //     try {
    //         this._userManagementService.getPatients(0).subscribe((res: Patient[]) => {
    //             console.log(res);
    //             this.users = res;
    //             console.log(this.users, 'my users');
    //             this.dataSource = this.dataSource = new MatTableDataSource(
    //                 this.users
    //             );
    //             this.isLoading = false;
    //         });
    //     } catch (error) {
    //         console.error('An error occurred while loading users:', error);
    //         // Handle the error here, such as showing an error message to the user
    //     }
    // }

    ngAfterViewInit() {
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
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
        this._userManagementService.getPatientById(productId)
            .subscribe((product) => {

                // Set the selected product
                this.selectedUser = product;

                // Fill the form
                this.selectedProductForm.patchValue(product);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    closeDetails(): void {
        this.selectedUser = null;
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
        const product = this.selectedProductForm.getRawValue();

        // Remove the currentImageIndex field
        delete product.currentImageIndex;

        // Update the product on the server
        this._userManagementService.updatePatient(product.id, product).subscribe(() => {

            // Show a success message
            this.showFlashMessage('success');
        });
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
                this._userManagementService.deletePatient(product.id).subscribe(() => {

                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }


    loadAll(page?: number, size?: number, query?: 'patientName') {
        this._userManagementService
        .getPatients(query, page, size)
        .subscribe((res: HttpResponse<Patient[]>) => {
            this.users = res.body;
            this.isLoading = true;
            // console.log(this.users, ' my users');
            this.dataSource = this.dataSource = new MatTableDataSource(
                this.users
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


    onPageChange(event): void {
        this.loadAll(event.pageIndex, event.pageSize);
    }

}
