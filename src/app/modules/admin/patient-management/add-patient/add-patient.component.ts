import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from 'app/model/patient';
import { PatientManagementService } from 'app/services/patient-service.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddPatientComponent implements OnInit {

    date = new FormControl(new Date());
    serializedDate = new FormControl(new Date().toISOString());

    @ViewChild('addUserNgForm') addUserNgForm: NgForm;

    alert: any;
    addUserForm: UntypedFormGroup;

    userRoles: string[] = [];

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _umService: PatientManagementService,
        private router: Router,

    ) {}
    ngOnInit(): void {
        this.addUserForm = this._formBuilder.group({
            patientName: ['', Validators.required],
            active: ['', Validators.required],
            contactPerson: ['', Validators.required],
            address: ['', Validators.required],
            phoneNo: ['', Validators.required],
            referenceNo: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            remarks:[''],
            dob:[''],
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
        this.addUserNgForm.resetForm();
    }

    /**
     * Send the form
     */
    sendForm(): void {
        if (this.addUserForm.valid) {
            const patient: Patient = {
                patientName: this.addUserForm.get('patientName').value,
                active: this.addUserForm.get('active').value,
                contactPerson: this.addUserForm.get('contactPerson').value,
                address: this.addUserForm.get('address').value,
                state: this.addUserForm.get('state').value,
                city: this.addUserForm.get('city').value,
                referenceNo: this.addUserForm.get('referenceNo').value,
                phoneNo: this.addUserForm.get('phoneNo').value,
                remarks: this.addUserForm.get('remarks').value,
                dob: this.addUserForm.get('dob').value,

            };

           this._umService.createPatient(patient).subscribe(
            () => {
              // Show success message
              this.alert = {
                type: 'success',
                message: 'Patient has been created successfully. Navigate back to patient Management and verify the new patient.'
              };

              this.router.navigate(['/patient-management/']);

              setTimeout(() => {
                this.alert = null;
              }, 3000);

              // Clear the form
              this.clearForm();

            //   this.router.navigate(['/patient-management/']);
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
          // Show form validation error message
          this.alert = {
            type: 'error',
            message: 'Please fill in all required fields with valid values.'
          };

          setTimeout(() => {
            this.alert = null;
          }, 3000);
        }
      }

}
