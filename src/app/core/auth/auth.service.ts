import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { HttpHeaders } from '@angular/common/http';
import { User, UserAccount } from '../user/user.types';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/account/reset-password/init', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string, key: string): Observable<any> {
        return this._httpClient.post('/api/account/reset-password/finish', {
            newPassword: password,
            key,
        });
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: {
        email: string;
        password: string;
        rememberMe: boolean;
    }): Observable<any> {
        console.log(credentials, 'credintials');
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }
        return this._httpClient.post('api/authenticate', credentials).pipe(
            switchMap((response: any) => {
                return this._httpClient
                    .get('api/account', {
                        headers: new HttpHeaders().set(
                            'Authorization',
                            'Bearer ' + response.id_token
                        ),
                    })
                    .pipe(
                        switchMap((response2: User) => {
                            console.log(response2);
                            const user = new UserAccount();
                            user.id = response2.id;
                            user.login = response2.login;
                            user.name = response2.firstName;
                            user.firstName = response2.firstName;
                            user.lastName = response2.lastName;
                            user.email = response2.email;
                            user.avatar = response2.imageUrl;
                            user.status = 'online';
                            user.imageUrl = response2.imageUrl;
                            user.activated = response2.activated;
                            user.langKey = response2.langKey;
                            user.createdBy = response2.createdBy;
                            user.createDate = response2.createDate;
                            user.lastModifiedBy = response2.lastModifiedBy;
                            user.lastModifiedDate = response2.lastModifiedDate;
                            user.authorities = response2.authorities;

                            // Store the access token in the local storage
                            this.accessToken = response.id_token;

                            // Set the authenticated flag to true
                            this._authenticated = true;

                            // Store the user on the user service
                            this._userService.user = user;

                            // Return a new observable with the response
                            return of(response);
                        })
                    );
                // return this.getUserDetails({
                //     call: () => {
                //         this.accessToken = response.id_token;

                //         // Set the authenticated flag to true
                //         this._authenticated = true;

                //         // Store the user on the user service

                //         // Return a new observable with the response
                //         return of(response);
                //     },
                // });
            })
        );
    }

    // getUserDetails(): Observable<any> {
    //     // Sign in using the token
    //     return this._httpClient.get('api/account').pipe(
    //         switchMap((response2: User) => {
    //             console.log(response2);
    //             const user = new UserAccount();
    //             user.id = response2.id;
    //             user.login = response2.login;
    //             user.name = response2.firstName;
    //             user.firstName = response2.firstName;
    //             user.lastName = response2.lastName;
    //             user.email = response2.email;
    //             user.avatar = response2.imageUrl;
    //             user.status = 'online';
    //             user.imageUrl = response2.imageUrl;
    //             user.activated = response2.activated;
    //             user.langKey = response2.langKey;
    //             user.createdBy = response2.createdBy;
    //             user.createDate = response2.createDate;
    //             user.lastModifiedBy = response2.lastModifiedBy;
    //             user.lastModifiedDate = response2.lastModifiedDate;
    //             user.authorities = response2.authorities;

    //             // Store the access token in the local storage
    //             // this.accessToken = response.id_token;

    //             // Set the authenticated flag to true
    //             this._authenticated = true;

    //             // Store the user on the user service
    //             this._userService.user = user;

    //             // Return a new observable with the response
    //             return of(response2);
    //         })
    //     );
    // }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient.get('api/account').pipe(
            catchError(() =>
                // Return false
                of(false)
            ),
            switchMap((response: any) => {
                // alert(response)
                console.log(response);
                const user = new UserAccount();
                user.id = response.id;
                user.login = response.login;
                user.name = response.firstName;
                user.firstName = response.firstName;
                user.lastName = response.lastName;
                user.email = response.email;
                user.avatar = response.imageUrl;
                user.status = 'online';
                user.imageUrl = response.imageUrl;
                user.activated = response.activated;
                user.langKey = response.langKey;
                user.createdBy = response.createdBy;
                user.createDate = response.createDate;
                user.lastModifiedBy = response.lastModifiedBy;
                user.lastModifiedDate = response.lastModifiedDate;
                user.authorities = response.authorities;

                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.
                if (response.accessToken) {
                    this.accessToken = response.accessToken;
                }

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        login: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/register', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
