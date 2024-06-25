import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Clinic } from 'app/model/clinic';
import { Doctor } from 'app/model/doctor';
import { Qualification } from 'app/model/qualification';
import { ClinicServiceService } from 'app/services/clinic-service.service';
import { DoctorManagementService } from 'app/services/doctor-management.service';
import { DoctorQualificationService } from 'app/services/doctor-qualification.service';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';


@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddDoctorComponent implements OnInit {


  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());

  @ViewChild('addUserNgForm') addUserNgForm: NgForm;

  alert: any;
  addUserForm: UntypedFormGroup;

  userRoles: string[] = [];

  clinics: Clinic[] = [];

  qualifications: Qualification[] = [];

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _umService: DoctorManagementService,
    private _cliManagementService: ClinicServiceService,
    private _docQualiManagementService: DoctorQualificationService,
    private router: Router,

  ) { }
  ngOnInit(): void {
    this.addUserForm = this._formBuilder.group({
      name: ['', Validators.required],
      isActive: ['', Validators.required],
      designation: ['', Validators.required],
      createdDate: ['', Validators.required],
      updatedDate: ['', Validators.required],
      clinicId: ['', Validators.required],
      qualificationID: ['',Validators.required],
      phone: [''],
      monava: [''],
      tueava: [''],
      wedava: [''],
      thuava: [''],
      friava: [''],
      satava: [''],
      sunava: [''],
      monfrom: ['00:00'],
      tuefrom: ['00:00'],
      wedfrom: ['00:00'],
      thufrom: ['00:00'],
      frifrom: ['00:00'],
      satfrom: ['00:00'],
      sunfrom: ['00:00'],
      monto: ['00:00'],
      tueto: ['00:00'],
      wedto: ['00:00'],
      thuto: ['00:00'],
      frito: ['00:00'],
      satto: ['00:00'],
      sunto: ['00:00'],

    });

    this.addUserForm.patchValue({
      createdDate: new Date().toISOString(),
    });

    this.addUserForm.patchValue({
      updatedDate: new Date().toISOString(),
    });

    this._umService
      .getAuthorities()
      .subscribe((resp) => (this.userRoles = resp));

    this._cliManagementService.getClinicss().subscribe(
      (response) => {
        //   alert(JSON.stringify(response));
        this.clinics = response.body;
        console.log(response)
      },
      (error) => {
        console.log(error);
      }
    );


    this._docQualiManagementService.getQualificationList().subscribe(
        (response) => {
            //   alert(JSON.stringify(response));
            this.qualifications = response.body;
            console.log(response)
        },
        (error) => {
            console.log(error);
        }
    );
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
      const user: Doctor = {
        name: this.addUserForm.get('name').value,
        isActive: this.addUserForm.get('isActive').value,
        designation: this.addUserForm.get('designation').value,
        createdDate: this.addUserForm.get('createdDate').value,
        updatedDate: this.addUserForm.get('updatedDate').value,
        phone: this.addUserForm.get('phone').value,
        clinicId : this.addUserForm.get('clinicId').value,
        qualificationName: this.addUserForm.get('qualificationID').value,
        monava: this.addUserForm.get('monava').value,
        tueava: this.addUserForm.get('tueava').value,
        wedava: this.addUserForm.get('wedava').value,
        thuava: this.addUserForm.get('thuava').value,
        friava: this.addUserForm.get('friava').value,
        satava: this.addUserForm.get('satava').value,
        sunava: this.addUserForm.get('sunava').value,
        monfrom: parseInt(this.addUserForm.get('monfrom').value.split(":").join('')),
        tuefrom: parseInt(this.addUserForm.get('tuefrom').value.split(":").join('')),
        wedfrom: parseInt(this.addUserForm.get('wedfrom').value.split(":").join('')),
        thufrom: parseInt(this.addUserForm.get('thufrom').value.split(":").join('')),
        frifrom: parseInt(this.addUserForm.get('frifrom').value.split(":").join('')),
        satfrom: parseInt(this.addUserForm.get('satfrom').value.split(":").join('')),
        sunfrom: parseInt(this.addUserForm.get('sunfrom').value.split(":").join('')),
        monto: parseInt(this.addUserForm.get('monto').value.split(":").join('')),
        tueto: parseInt(this.addUserForm.get('tueto').value.split(":").join('')),
        wedto: parseInt(this.addUserForm.get('wedto').value.split(":").join('')),
        thuto: parseInt(this.addUserForm.get('thuto').value.split(":").join('')),
        frito: parseInt(this.addUserForm.get('frito').value.split(":").join('')),
        satto: parseInt(this.addUserForm.get('satto').value.split(":").join('')),
        sunto: parseInt(this.addUserForm.get('sunto').value.split(":").join('')),
      };

      this._umService.createUser(user).subscribe(
        () => {
          // Show success message
          this.alert = {
            type: 'success',
            message: 'Doctor has been created successfully. Navigate back to Doctor Management and verify the new doctor.'
          };

          this.router.navigate(['doctor-management']);

          setTimeout(() => {
            this.alert = null;
          }, 5000);

          // Clear the form
          this.clearForm();

        //   this.router.navigate(['/doctor-management/']);
        },
        (error) => {
          // Show error message
          this.alert = {
            type: 'error',
            message: 'An error occurred while creating the doctor.'
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

    //   selectedTime{

    //   }

}
