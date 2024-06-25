import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'app/model/product';
import { ProductManagementService } from 'app/services/product-management.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddProductComponent {

    date = new FormControl(new Date());
    serializedDate = new FormControl(new Date().toISOString());

    @ViewChild('addProductNgForm') addProductNgForm: NgForm;

    alert: any;
    addProductForm: UntypedFormGroup;

    userRoles: string[] = [];

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _umService: ProductManagementService,
        private router: Router,

    ) {}
    ngOnInit(): void {
        this.addProductForm = this._formBuilder.group({
            productName: ['', Validators.required],
            productCode: ['', Validators.required],
            active: ['', Validators.required],
            productDesp: ['', Validators.required],
            expireDate: ['',Validators.required],
            retailPrice:['',Validators.required],
            discountPrice: ['', Validators.required],
            // cost: ['', Validators.required],
            priceIncludeTax: ['', Validators.required],
            qty: ['', Validators.required],

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
        this.addProductNgForm.resetForm();
    }



    /**
     * Send the form
     */
    sendForm(): void {
        if (this.addProductForm.valid) {
          const product: Product = {
            productName: this.addProductForm.get('productName').value,
            productCode: this.addProductForm.get('productCode').value,
            active: this.addProductForm.get('active').value,
            productDesp: this.addProductForm.get('productDesp').value,
            expireDate: this.addProductForm.get('expireDate').value,
            retailPrice: this.addProductForm.get('retailPrice').value,
            discountPrice: this.addProductForm.get('discountPrice').value,
            priceIncludeTax: this.addProductForm.get('priceIncludeTax').value,
            // cost: this.addProductForm.get('cost').value,
            qty: this.addProductForm.get('qty').value,
          };

          this._umService.addProduct(product).subscribe(
            () => {
              // Show success message
              this.alert = {
                type: 'success',
                message: 'Product has been added successfully. Navigate back to Product list.'
              };

              this.router.navigate(['product-management']);

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
                message: 'An error occurred while adding the product.'
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

      // getCurrentDate(): string {
      //   const currentDate = new Date();
      //   const year = currentDate.getFullYear();
      //   const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      //   const day = currentDate.getDate().toString().padStart(2, '0');
      //   return `${year}-${month}-${day}`;
      // }

}
