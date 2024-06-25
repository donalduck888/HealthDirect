import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Product, ProductManagementPagination } from 'app/model/product';
import { ProductManagementService } from 'app/services/product-management.service';
import { Subject, debounceTime, switchMap, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'app-product-management',
    templateUrl: './product-management.component.html',
    styleUrls: ['./product-management.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ProductManagementComponent {

    products: Product[] = [];
    checked: boolean;
    isLoading: boolean = false;
    flashMessage: 'success' | 'error' | null = null;
    pagination: ProductManagementPagination;

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
    dataSource: MatTableDataSource<Product>;
    // dataSource = new MatTableDataSource<Doctor>(this.users);

    @ViewChild(MatSort) sort: MatSort;
    selectedProductForm: UntypedFormGroup;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: Product;
    private _unsubscribeAll: Subject<any> = new Subject<any>();



    constructor(private _userManagementService: ProductManagementService,
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
            .subscribe((pagination: ProductManagementPagination) => {

                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        this.selectedProductForm = this._formBuilder.group({

            id:[''],
            productName: [''],
            productCode: [''],
            qty: [''],
            expireDate: [''],
            retailPrice: [''],
            discountPrice: [''],
            active: [''],
            productDesp: [''],
            priceIncludeTax: ['']

        });

    }

    test() {
        this._userManagementService.test();
    }


    loadAll(page?: number, size?: number, query?: 'productName') {
        this._userManagementService
            .getProducts(query, page, size)
            .subscribe((res: HttpResponse<Product[]>) => {
                this.products = res.body;
                this.isLoading = true;
                // console.log(this.users, ' my users');
                this.dataSource = this.dataSource = new MatTableDataSource(
                    this.products
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
                    return this._userManagementService.searchProducts(query, 0, 10);
                }),
                tap((results) => {
                    this.products = results; // Update the users array with the search results
                    this.dataSource = new MatTableDataSource(this.products);
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



    addProduct() { }

    toggleDetails(productId: string): void {
        // If the product is already selected...
        if (this.selectedProduct && this.selectedProduct.id === productId) {
            // Close the details
            this.closeDetails();
            return;
        }

        // Set the selected product
        this.selectedProduct = this.products.find((u) => u.id === productId);
        this._changeDetectorRef.markForCheck();

        // Get the product by id
        this._userManagementService.getProductById(productId)
            .subscribe((product) => {

                // Set the selected product
                this.selectedProduct = product;

                // Fill the form
                this.selectedProductForm.patchValue(product);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    closeDetails(): void {
        this.selectedProduct = null;
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
        this._userManagementService.updateProduct(product.id, product).subscribe(() => {






            // Show a success message
            this.showFlashMessage('success');
        });
    }

    onPageChange(event): void {
        this.loadAll(event.pageIndex, event.pageSize);
    }

    deleteSelectedProduct(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete product',
            message: 'Are you sure you want to remove this Product? This action cannot be undone!',
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
