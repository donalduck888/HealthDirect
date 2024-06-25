import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormControl,
    NgForm,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Authority } from 'app/core/config/authority.constants';
import { UserMangementService } from '../userManagement.service';
import { User } from 'app/core/user/user.types';
import { Router } from '@angular/router';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AddUserComponent implements OnInit {
    @ViewChild('addUserNgForm') addUserNgForm: NgForm;

    alert: any;
    addUserForm: UntypedFormGroup;

    userRoles: string[] = [];

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _umService: UserMangementService,
        private router: Router, 
  
    ) {}
    ngOnInit(): void {
        this.addUserForm = this._formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            login: [
                '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(35),
                ],
            ],
            activated: [''],
            langKey: ['en'], 
            authorities: [, Validators.required],
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
          const user: User = {
            login: this.addUserForm.get('login').value,
            firstName: this.addUserForm.get('firstName').value,
            lastName: this.addUserForm.get('lastName').value, 
            email: this.addUserForm.get('email').value,
            activated: this.addUserForm.get('activated').value,
            langKey: this.addUserForm.get('langKey').value,
            authorities: this.addUserForm.get('authorities').value
          }; 
      
          this._umService.newCreateUser(user).subscribe(
            () => {
              // Show success message
              this.alert = {
                type: 'success',
                message: 'User has been created successfully. Navigate back to User Management and verify the new user.'
              };
      
              setTimeout(() => {
                this.alert = null;
              }, 5000);
      
              // Clear the form
              this.clearForm();

              this.router.navigate(['/user-management/']);
            },
            (error) => {
              // Show error message
              this.alert = {
                type: 'error',
                message: 'An error occurred while creating the user.'
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
