import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Qualification } from 'app/model/qualification';
import { DoctorQualificationService } from 'app/services/doctor-qualification.service';

@Component({
  selector: 'app-add-qualification',
  templateUrl: './add-qualification.component.html',
  styleUrls: ['./add-qualification.component.scss']
})
export class AddQualificationComponent implements OnInit {

    date = new FormControl(new Date());
    serializedDate = new FormControl(new Date().toISOString());

  @ViewChild('addUserNgForm') addUserNgForm: NgForm;

    alert: any;
    addUserForm: UntypedFormGroup;

    userRoles: string[] = [];

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _umService: DoctorQualificationService,
        private router: Router,

    ) {}
    ngOnInit(): void {
        this.addUserForm = this._formBuilder.group({
            qualificationName: ['', Validators.required],
            qualificationShortName: ['', Validators.required],
            description: ['', Validators.required],
            qualificationType: ['', Validators.required],

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
            const qualification: Qualification = {
                qualificationName: this.addUserForm.get('qualificationName').value,
                qualificationShortName: this.addUserForm.get('qualificationShortName').value,
                description: this.addUserForm.get('description').value,
                qualificationType: this.addUserForm.get('qualificationType').value,

            };

            this._umService.addQualification(qualification).subscribe(
            () => {
              // Show success message
                this.alert = {
                type: 'success',
                message: 'Doctor Qualification has been added successfully.'
                };

                this.router.navigate(['doctor-management']);

                setTimeout(() => {
                this.alert = null;
                }, 5000);

                // Clear the form
                this.clearForm();

                // this.router.navigate(['/doctor-management/doctor-qualification']);
            },
            (error) => {
                // Show error message
                this.alert = {
                type: 'error',
                message: 'An error occurred while adding the qualification.'
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

    //   selectedTime{

    //   }

}
