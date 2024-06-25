import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DoctorQualificationPagination, Qualification } from 'app/model/qualification';
import { DoctorQualificationService } from 'app/services/doctor-qualification.service';
import { Subject, debounceTime, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-doctor-qualification',
  templateUrl: './doctor-qualification.component.html',
  styleUrls: ['./doctor-qualification.component.scss']
})
export class DoctorQualificationComponent {

    qualifications: Qualification[] = [];
    checked: boolean;
    isLoading: boolean = false;
    flashMessage: 'success' | 'error' | null = null;
    pagination: DoctorQualificationPagination;

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
    dataSource: MatTableDataSource<Qualification>;
    // dataSource = new MatTableDataSource<Doctor>(this.users);

    @ViewChild(MatSort) sort: MatSort;
    selectedProductForm: UntypedFormGroup;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedUser: Qualification;
    private _unsubscribeAll: Subject<any> = new Subject<any>();



    constructor(private _userManagementService: DoctorQualificationService,
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
            .subscribe((pagination: DoctorQualificationPagination) => {
                // console.log(pagination, 'pagination');
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        this.selectedProductForm = this._formBuilder.group({
            id: [''],
            qualificationName: [''],
            qualificationShortName: [''],
            description: [''],
            qualificationType: [''],

        });

    }

    test() {
        this._userManagementService.test();
    }



    loadAll(page?: number, size?: number, query?: 'qualificationName') {
        this._userManagementService
            .getQualifications(query, page, size)
            .subscribe((res: HttpResponse<Qualification[]>) => {
                this.qualifications = res.body;
                this.isLoading = true;
                // console.log(this.users, ' my users');
                this.dataSource = this.dataSource = new MatTableDataSource(
                    this.qualifications
                );
                this.isLoading = false;

            });

        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._userManagementService.searchQualifications(query, 0, 10);
                }),
                tap((results) => {
                    this.qualifications = results; // Update the users array with the search results
                    this.dataSource = new MatTableDataSource(this.qualifications);
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }



    addQualification() { }

    toggleDetails(productId: string): void {
        // If the product is already selected...
        if (this.selectedUser && this.selectedUser.id === productId) {
            // Close the details
            this.closeDetails();
            return;
        }

        // Set the selected product
        this.selectedUser = this.qualifications.find((u) => u.id === productId);
        this._changeDetectorRef.markForCheck();

        // Get the product by id
        this._userManagementService.getQualificationById(productId)
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
        const product = this.selectedProductForm.getRawValue();

        // Remove the currentImageIndex field
        delete product.currentImageIndex;
        // this.router.navigate(['']);

        // Update the product on the server
        this._userManagementService.updateQualification(product.id, product).subscribe(() => {



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
            title: 'Delete Qualification',
            message: 'Are you sure you want to remove this Qualification? This action cannot be undone!',
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
                this._userManagementService.deleteQualification(product.id).subscribe(() => {

                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }

}
