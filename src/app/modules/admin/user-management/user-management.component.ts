import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
// import { UserMangementService } from './userManagement.service'
import { UserMangementService } from './userManagement.service';
import { User, UserManagementPagination } from 'app/core/user/user.types';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators,FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { Subject, debounceTime, switchMap, takeUntil, tap } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { formatDate } from '@angular/common';

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,

    animations: fuseAnimations,
})
export class UserManagementComponent implements OnInit {
    users: User[] = [];
    userRoles: string[] = [];
    checked: boolean;
    isLoading = true;
    flashMessage: 'success' | 'error' | null = null;

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    selectedProductForm: UntypedFormGroup;

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
    dataSource: MatTableDataSource<User>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedUser: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    pagination: UserManagementPagination;

    constructor(private _userManagementService: UserMangementService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _umService: UserMangementService,
        private _changeDetectorRef: ChangeDetectorRef,) {}

    ngOnInit(): void {
        // this.users = [];
        this.loadAll();
        this._userManagementService.pagination$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((pagination: UserManagementPagination) => {
            // console.log(pagination, 'pagination');
            // Update the pagination
            this.pagination = pagination;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        this.selectedProductForm = this._formBuilder.group({
            id:[''], 
            login: [''],
            firstName: [''],
            lastName: [''],
            email: [''], 
            lastModifiedDate : [''],
            activated: [''],  
            authorities: [''], 
        });
        this._umService
            .getAuthorities() 
            .subscribe((resp) => (this.userRoles = resp));

           
    }

    test() {
        this._userManagementService.test();
    }


    loadAll(page?: number, size?: number, query?: 'login') {
        this._userManagementService
            .getUsers(query, page, size)
            .subscribe((res: HttpResponse<User[]>) => {
                this.users = res.body;
                this.isLoading = true;
                this.dataSource = this.dataSource = new MatTableDataSource(
                    this.users
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
                    return this._userManagementService.searchUsers(query, 0, 10);
                }),
                tap((results) => {
                    this.users = results; // Update the users array with the search results
                    this.dataSource = new MatTableDataSource(this.users);
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

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

    toggleActive(user: User, $event) {
        this._userManagementService
            .updateUsers({
                ...user,
                activated: $event.checked,
            })
            .subscribe((res) => console.log(res));
        // this.loadAll();
    }
    createUser() {}

    showFlashMessage(type: 'success' | 'error'): void
    {
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

    deleteSelectedProduct()

    {


    }

    // updateSelectedProduct(): void {
    //     // Get the user object from the form
    //     const user: User = this.selectedProductForm.value;

    //     // Update the user on the server
    //     this._userManagementService.updateUsers(user).subscribe(() => {
    //       // Show a success message
    //       this.showFlashMessage('success');
    //     }, error => {
    //       // Handle error here
    //       console.error(error);
    //       this.showFlashMessage('error');
    //     });
    //   }


      updateSelectedProduct(): void { 
        // Get the product object
        const product = this.selectedProductForm.getRawValue()

        // product.lastModifiedDate = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en-US');

        // Remove the currentImageIndex field
        delete product.currentImageIndex; 
        // this.router.navigate(['']);

        // Update the product on the server
        this._userManagementService.updateUser(product).subscribe(() => { 


            // Show a success message
            this.showFlashMessage('success');
        });
    }


    toggleDetails(productId: string): void {
        // If the product is already selected...
        if (this.selectedUser && this.selectedUser.login === productId) {
            // Close the details
            this.closeDetails();
            return;
        }

        // Set the selected product
        this.selectedUser = this.users.find((u) => u.login === productId);  
        this._changeDetectorRef.markForCheck();

        // Get the product by id
        this._userManagementService.getUserByUsername(productId) 
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

    onPageChange(event): void {
        this.loadAll(event.pageIndex, event.pageSize);
    }
}
