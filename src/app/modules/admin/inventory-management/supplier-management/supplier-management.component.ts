import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Supplier, SupplierManagementPagination } from 'app/model/supplier';
import { SupplierManagementService } from 'app/services/supplier-management.service';
import { Subject, debounceTime, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-supplier-management',
  templateUrl: './supplier-management.component.html',
  styleUrls: ['./supplier-management.component.scss']
})
export class SupplierManagementComponent {

    suppliers: Supplier[] = [];
    checked: boolean;
    isLoading: boolean = false;
    flashMessage: 'success' | 'error' | null = null;
    pagination: SupplierManagementPagination;

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
    dataSource: MatTableDataSource<Supplier>;
    // dataSource = new MatTableDataSource<Doctor>(this.users);

    @ViewChild(MatSort) sort: MatSort;
    selectedSupplierForm: UntypedFormGroup;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedSupplier: Supplier;
    private _unsubscribeAll: Subject<any> = new Subject<any>();



    constructor(private _userManagementService: SupplierManagementService,
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
            .subscribe((pagination: SupplierManagementPagination) => {

                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        this.selectedSupplierForm = this._formBuilder.group({

            id:[''],
            name: [''],
            address: [''],
            city: [''],
            remarks: [''],
            contactPhone: [''],
            contactPerson: [''],
            isActive: [''],


        });

    }

    test() {
        this._userManagementService.test();
    }


    loadAll(page?: number, size?: number, query?: 'name') {
        this._userManagementService
            .getSuppliers(query, page, size)
            .subscribe((res: HttpResponse<Supplier[]>) => {
                this.suppliers = res.body;
                this.isLoading = true;
                // console.log(this.users, ' my users');
                this.dataSource = this.dataSource = new MatTableDataSource(
                    this.suppliers
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
                    return this._userManagementService.searchSuppliers(query, 0, 10);
                }),
                tap((results) => {
                    this.suppliers = results; // Update the users array with the search results
                    this.dataSource = new MatTableDataSource(this.suppliers);
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



    addSupplier() { }

    toggleDetails(id: string): void {
        // If the supplier is already selected...
        if (this.selectedSupplier && this.selectedSupplier.id === id) {
            // Close the details
            this.closeDetails();
            return;
        }

        // Set the selected product
        this.selectedSupplier = this.suppliers.find((u) => u.id === id);
        this._changeDetectorRef.markForCheck();

        // Get the product by id
        this._userManagementService.getSupplierById(id)
            .subscribe((supplier) => {

                // Set the selected product
                this.selectedSupplier = supplier;

                // Fill the form
                this.selectedSupplierForm.patchValue(supplier);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    closeDetails(): void {
        this.selectedSupplier = null;
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

    updateSelectedSupplier(): void {
        // Get the product object
        const supplier = this.selectedSupplierForm.getRawValue();

        // Remove the currentImageIndex field
        delete supplier.currentImageIndex;
        // this.router.navigate(['']);

        // Update the product on the server
        this._userManagementService.updateSupplier(supplier.id, supplier).subscribe(() => {






            // Show a success message
            this.showFlashMessage('success');
        });
    }

    onPageChange(event): void {
        this.loadAll(event.pageIndex, event.pageSize);
    }

    deleteSelectedSupplier(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Supplier',
            message: 'Are you sure you want to remove this Supplier? This action cannot be undone!',
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
                const supplier = this.selectedSupplierForm.getRawValue();

                // Delete the product on the server
                this._userManagementService.deleteSupplier(supplier.id).subscribe(() => {

                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }

}
