import { AuthService } from 'app/core/auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    /**
     * Constructor
     */
    constructor() {}

    ngOnInit(): void {
        // this.authService.getUserDetails()
        // this.authService.getUserDetails().subscribe((d) => {
        //     // alert(JSON.stringify(d));
        // });
    }
}
