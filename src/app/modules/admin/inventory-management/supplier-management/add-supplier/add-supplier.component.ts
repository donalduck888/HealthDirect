import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Supplier } from 'app/model/supplier';
import { SupplierManagementService } from 'app/services/supplier-management.service';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddSupplierComponent {

    date = new FormControl(new Date());
    serializedDate = new FormControl(new Date().toISOString());

    @ViewChild('addSupplierNgForm') addSupplierNgForm: NgForm;

    alert: any;
    addSupplierForm: UntypedFormGroup;

    userRoles: string[] = [];

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _umService: SupplierManagementService,
        private router: Router,

    ) {}


    ngOnInit(): void {
        this.addSupplierForm = this._formBuilder.group({
            name: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            contactPerson: ['', Validators.required],
            contactPhone: ['',Validators.required],
            remarks:['',Validators.required],
            isActive: ['', Validators.required],


        });

        this._umService
            .getAuthorities()
            .subscribe((resp) => (this.userRoles = resp));
    }

    /**
     * Clear the form
     */
    clearForm(): void {
        // Reset the form
        this.addSupplierNgForm.resetForm();
    }



    /**
     * Send the form
     */
    sendForm(): void {
        if (this.addSupplierForm.valid) {
          const supplier: Supplier = {
            name: this.addSupplierForm.get('name').value,
            city: this.addSupplierForm.get('city').value,
            address: this.addSupplierForm.get('address').value,
            contactPerson: this.addSupplierForm.get('contactPerson').value,
            contactPhone: this.addSupplierForm.get('contactPhone').value,
            remarks: this.addSupplierForm.get('remarks').value,
            isActive: this.addSupplierForm.get('isActive').value,

          };

          this._umService.addSupplier(supplier).subscribe(
            () => {
              // Show success message
              this.alert = {
                type: 'success',
                message: 'Supplier has been added successfully. Navigate back to Supplier list.'
              };

              this.router.navigate(['product-management/supplier-management']);

              setTimeout(() => {
                this.alert = null;
              }, 5000);

              // Clear the form
              this.clearForm();

            //   this.router.navigate(['/inventory-management/product-management']);
            },
            (error) => {
              // Show error message
              this.alert = {
                type: 'error',
                message: 'An error occurred while adding the supplier.'
              };

              setTimeout(() => {
                this.alert = null;
              }, 5000);

              console.error(error);
            }
          );
        } else {
          // Show form validation error message
          this.alert = {
            type: 'error',
            message: 'Please fill in all required fields with valid values.'
          };

          setTimeout(() => {
            this.alert = null;
          }, 5000);
        }
      }

}
