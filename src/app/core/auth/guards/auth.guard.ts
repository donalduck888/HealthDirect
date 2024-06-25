import { Injectable } from '@angular/core';
import { CanMatch, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { Authority } from 'app/core/config/authority.constants';
import {
    defaultNavigation,
    defaultNavigationSet,
} from 'app/mock-api/common/navigation/data';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanMatch {
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _userService: UserService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can match
     *
     * @param route
     * @param segments
     */
    canMatch(
        route: Route,
        segments: UrlSegment[]
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        // console.log(route.data, 'hello');
        return this._check(segments, route.data['authorities']);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param segments
     * @private
     */
    private _check(
        segments: UrlSegment[],
        data
    ): Observable<boolean | UrlTree> {
        // Check the authentication status
        return this._authService.check().pipe(
            switchMap((authenticated) => {
                // console.log(data, 'test');

                // If the user is not authenticated...
                if (!authenticated) {
                    // Redirect to the sign-in page with a redirectUrl param
                    const redirectURL = `/${segments.join('/')}`;
                    const urlTree = this._router.parseUrl(
                        `sign-in?redirectURL=${redirectURL}`
                    );

                    return of(urlTree);
                }

                // return this._userService.user$.pipe(
                //     switchMap((resp) => {
                //         if (resp === undefined) {
                //             return this._authService.signInUsingToken().pipe(
                //                 switchMap((user) => {
                //                     return of(false);
                //                 })
                //             );
                //         } else {
                //             const userRoleCheck = resp.authorities.some(
                //                 (authority: string) => data.includes(authority)
                //             );

                //             if (resp.authorities.includes(Authority.ADMIN)) {
                //                 if (
                //                     defaultNavigation.find(
                //                         (e) => e.id === 'user-management'
                //                     ) === undefined
                //                 ) {
                //                     defaultNavigation.push({
                //                         id: 'user-management',
                //                         title: 'User Management',
                //                         type: 'basic',
                //                         icon: 'heroicons_outline:chart-pie',
                //                         link: '/user-management',
                //                     });
                //                     return of(true);
                //                 }
                //             } else {
                //                 if (
                //                     defaultNavigation.find(
                //                         (e) => e.id === 'test-admin-component'
                //                     ) === undefined
                //                     // !defaultNavigation.includes({
                //                     //     id: 'test-admin-component',
                //                     //     title: 'Test Admin',
                //                     //     type: 'basic',
                //                     //     icon: 'heroicons_outline:chart-pie',
                //                     //     link: '/app-test-admin-component',
                //                     //     // meta: [Authority.ADMIN],
                //                     // })
                //                 ) {
                //                     defaultNavigation.push({
                //                         id: 'test-admin-component',
                //                         title: 'performance',
                //                         type: 'basic',
                //                         icon: 'heroicons_outline:chart-pie',
                //                         link: '/app-test-admin-component',
                //                         // meta: [Authority.ADMIN],
                //                     });
                //                 }
                //                 // alert('some')
                //             }

                //             if (userRoleCheck) {
                //                 return of(true);
                //             }

                //             return of(false);
                //         }

                //         // return of(false);
                //     })
                // );
                return of(true);
            })
        );
    }
    navigationManipulation() {}
}
