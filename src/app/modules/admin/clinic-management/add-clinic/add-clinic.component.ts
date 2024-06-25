import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Clinic } from 'app/model/clinic';
import { ClinicServiceService } from 'app/services/clinic-service.service';

@Component({
    selector: 'app-add-clinic',
    templateUrl: './add-clinic.component.html',
    styleUrls: ['./add-clinic.component.scss']
})

export class AddClinicComponent implements OnInit {

    date = new FormControl(new Date());
    serializedDate = new FormControl(new Date().toISOString());

    @ViewChild('addUserNgForm') addUserNgForm: NgForm;

    alert: any;
    addUserForm: UntypedFormGroup;

    userRoles: string[] = [];

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _umService: ClinicServiceService,
        private router: Router,

    ) {}
    ngOnInit(): void {
        this.addUserForm = this._formBuilder.group({
            clinicName: ['', Validators.required],
            // doctorId: ['', Validators.required],
            clinicAddress: ['', Validators.required],
            clinicCity: ['', Validators.required],
            hotline1: ['',Validators.required],
            hotline2: [''],
            createdDate: [''],
            remark: ['',Validators.required],



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
            const clinic: Clinic = {
                clinicName: this.addUserForm.get('clinicName').value,
                clinicAddress: this.addUserForm.get('clinicAddress').value,
                clinicCity: this.addUserForm.get('clinicCity').value,
                remark: this.addUserForm.get('remark').value,
                hotline1: this.addUserForm.get('hotline1').value,
                hotline2: this.addUserForm.get('hotline2').value,
                createdDate: this.addUserForm.get('createdDate').value

            };

            this._umService.addClinic(clinic).subscribe(
            () => {
                // Show success message
                this.alert = {
                    type: 'success',
                    message: 'Clinic has been created successfully. Navigate back to Clinic Directory and verify the new clinic.'
                };

                this.router.navigate(['clinic-management']);
                
                setTimeout(() => {
                    this.alert = null;
                }, 5000);

                // Clear the form
                this.clearForm(); //form eka reset wunna ne - yep kal alert eken passe reset una after 5s ah areka udin navigate karann onaam


            },
            (error) => {
                // Show error message
                this.alert = {
                type: 'error',
                message: 'An error occurred while creating the clinic.'
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
