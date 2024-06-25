import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Appointment } from 'app/model/appointment';
import { Product } from 'app/model/product';
import { TreatmentNote } from 'app/model/treatmentnote';
import { ProductManagementService } from 'app/services/product-management.service';
import { TreatmentNoteService } from 'app/services/treatment-note.service';
import moment from 'moment';

@Component({
  selector: 'app-complete-appointment',
  templateUrl: './complete-appointment.component.html',
  styleUrls: ['./complete-appointment.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class CompleteAppointmentComponent implements OnInit {

  alert: any;
  addUserForm: FormGroup;
  products: Product[] = []

  constructor(public dialogRef: MatDialogRef<CompleteAppointmentComponent>,
    private formBuilder: FormBuilder,
    private _TreatmentService: TreatmentNoteService,
    private _proService: ProductManagementService,
    @Inject(MAT_DIALOG_DATA) public appointment: Appointment

  ) { }


  ngOnInit(): void {

    this._proService.getAllProducts().subscribe(
      (response) => {
        //   alert(JSON.stringify(response));
        this.products = response.body;
        console.log(response)
      },
      (error) => {
        console.log(error);
      }
    );

    this.addUserForm = this.formBuilder.group({
      issueDate: [this.appointment?.appDate],
      doctorId: [''],
      doctorName: [this.appointment?.doctorName],
      note: [''],
      remarks: [''],
      fileUrl: [''],
      productName: [''],
      prescription: [''],
      qty: [''],
      unit: [''],
      patientId: [''],
      patientName: [this.appointment?.patientName],
      products: this.formBuilder.array([]),
    });

    if (this.entityArray.length === 0) {
      this.addEntity();
    }
  }

  get entityArray() {
    return this.addUserForm.get('products') as FormArray;
  }

  addEntity() {
    const newEntity = this.formBuilder.group({
      productId: [''],
      productCode: [''],
      productName: [''],
      active: [''],
      productDesp: [''],
      expireDate: [''],
      mcatId: [''],
      subCatId: [''],
      retailPrice: [''],
      cost: [''], 
      qty: [''],
      discountPrice: [''],
      priceIncludeTax: [''],
    });
    this.entityArray.push(newEntity);
  }

  removeEntity(index: number) {
    this.entityArray.removeAt(index);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  sendForm(): void {
    if (this.addUserForm.valid) {
      const treatment: TreatmentNote = {
        issueDate: this.addUserForm.get('issueDate').value,
        doctorId: this.addUserForm.get('doctorId').value,
        doctorName: this.addUserForm.get('doctorName').value,
        note: this.addUserForm.get('note').value,
        remarks: this.addUserForm.get('remarks').value,
        fileUrl: this.addUserForm.get('fileUrl').value,
        productName: this.addUserForm.get('productName').value,
        prescription: this.addUserForm.get('prescription').value,
        qty: this.addUserForm.get('qty').value,
        unit: this.addUserForm.get('unit').value,
        patientId: this.addUserForm.get('patientId').value,
        patientName: this.addUserForm.get('patientName').value,
        products: this.addUserForm.get('products').value,
      };

      this._TreatmentService.createUser(treatment).subscribe(
        () => {
          // Show success message
          this.alert = {
            type: 'success',
            message: 'Traetment note has been created successfully'
          };

          setTimeout(() => {
            this.alert = null;
          }, 3000);

        },
        (error) => {
          // Show error message
          this.alert = {
            type: 'error',
            message: 'An error occurred while creating the patient.'
          };

          setTimeout(() => {
            this.alert = null;
          }, 6000);

          console.error(error);
        }
      );
    } else {
      this.alert = {
        type: 'error',
        message: 'Please fill in all required fields with valid values.'
      };
      setTimeout(() => {
        this.alert = null;
      }, 3000);
    }
  }

  updateCost() {
    const products = this.addUserForm.get('products') as FormArray;
    for (let i = 0; i < products.length; i++) {
      const product = products.at(i) as FormGroup;
      const qty = product.get('qty').value; 
      const retailPrice = product.get('retailPrice').value;
      const cost = qty * retailPrice;
      // console.log('quantity:' + qty, 'price:' + retailPrice, 'cost :' + cost) 
      product.patchValue({ cost: cost });
    }
  }

  updateRetailPrice(index: number): void {
    const product = this.entityArray.at(index) as FormGroup;
    const productName = product.get('productName').value;
    const selectedProduct = this.products.find((p) => p.id === productName);
    if (selectedProduct) {
      product.patchValue({ retailPrice: selectedProduct.retailPrice });
    } else {
      product.patchValue({ retailPrice: 0 });
    }
  }

  parseTimeZone(time:string){
    return moment.utc(moment(time.replace('Z',''))).format()
  }

}
