import { user } from './mock-api/common/user/data';
import { User } from './core/user/user.types';
import { Route, UrlSegment } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { Authority } from './core/config/authority.constants';
import { UserService } from './core/user/user.service';
import { map } from 'rxjs';
import { inject } from '@angular/core';
import { defaultNavigation } from './mock-api/common/navigation/data';
// import { UserRouteAccessService } from './core/auth/user-route-access.service';

const hasRole = (role: Authority) =>
    inject(UserService).user$.pipe(
        map((user) => {
            const checkRole = user.authorities.some((authority: string) =>
                user.authorities.includes(role)
            );

            if (checkRole && role === Authority.ADMIN) {
                console.log('admin');

                if (
                    defaultNavigation.find(
                        (e) => e.id === 'dashboard'
                    ) === undefined
                )
                defaultNavigation.push({
                    id: 'dashboard',
                    title: 'Dashboard',
                    type: 'basic',
                    icon: 'heroicons_outline:view-grid',
                    link: '/dashboard',
                });


                if (
                    defaultNavigation.find(
                        (e) => e.id === 'user-management'
                    ) === undefined
                )
                    defaultNavigation.push({
                        id: 'user-management',
                        title: 'User Management',
                        type: 'basic',
                        icon: 'heroicons_outline:users',
                        link: '/user-management',
                    });

                if (
                    defaultNavigation.find(
                        (e) => e.id === 'appointment-management'
                    ) === undefined
                )
                    defaultNavigation.push({
                        id: 'appointment-management',
                        title: 'Appointments',
                        type: 'basic',
                        icon: 'heroicons_outline:calendar',
                        link: '/appointment-management',
                    });

                if (
                    defaultNavigation.find(
                        (e) => e.id === 'doctor-management'
                    ) === undefined
                )
                    defaultNavigation.push({
                        id: 'doctor-management',
                        title: 'Doctor Module',
                        type: 'collapsable',
                        icon: 'health_and_safety',

                        children: [
                            {
                                id   : 'doctor-management.product',
                                title: 'Doctor Management',
                                type : 'basic',
                                icon :'heroicons_solid:plus-circle',
                                exactMatch:true,
                                link : '/doctor-management'
                            },

                            {
                                id   : 'doctor-management.orders',
                                title: 'Doctor Qualifications',
                                type : 'basic',
                                icon :'heroicons_solid:badge-check',
                                exactMatch:false,
                                link : '/doctor-management/doctor-qualification'

                            }
                        ]
                    });

                if (
                    defaultNavigation.find(
                        (e) => e.id === 'patient-management'
                    ) === undefined
                )
                    defaultNavigation.push({
                        id: 'patient-management',
                        title: 'Patient Management',
                        type: 'basic',
                        icon: 'supervised_user_circle',
                        link: '/patient-management',
                    });

                if (
                    defaultNavigation.find(
                        (e) => e.id === 'clinic-management'
                    ) === undefined
                )
                    defaultNavigation.push({
                        id: 'clinic-management',
                        title: 'Clinic Management',
                        type: 'basic',
                        icon: 'heroicons_solid:office-building',
                        link: '/clinic-management',
                    });

                if (
                    defaultNavigation.find(
                        (e) => e.id === 'inventory-management'
                    ) === undefined
                )
                    defaultNavigation.push({
                        id: 'inventory-management',
                        title: 'Inventory Module',
                        type: 'collapsable',
                        icon: 'heroicons_solid:archive',
                        children: [
                            {
                                id   : 'inventory-management.supplier',
                                title: 'Supplier Management',
                                type : 'basic',
                                icon :'heroicons_solid:user-group',
                                exactMatch:false,
                                link : '/product-management/supplier-management'
                            },

                            {
                                id   : 'inventory-management.product',
                                title: 'Product Management',
                                type : 'basic',
                                exactMatch:true,
                                icon :'heroicons_solid:cube',
                                link : '/product-management'
                            },
                            {
                                id   : 'inventory-management.orders',
                                title: 'Order Management',
                                type : 'basic',
                                icon :'heroicons_solid:chart-pie',
                                link : '/order-management'
                            }
                        ]
                    });


                if (
                    defaultNavigation.find(
                        (e) => e.id === 'treatment-notes'
                    ) === undefined
                )
                    defaultNavigation.push({
                        id: 'treatment-notes',
                        title: 'Document Share',
                        type: 'basic',
                        icon: 'heroicons_solid:folder',
                        link: '/document-share',
                    });

            }
            console.log(role, checkRole);
            if (checkRole && role === Authority.USER) {
                console.log('user');
                if (
                    defaultNavigation.find(
                        (e) => e.id === 'test-admin-component'
                    ) === undefined
                ) {
                    defaultNavigation.push({
                        id: 'test-admin-component',
                        title: 'performance',
                        type: 'basic',
                        icon: 'heroicons_outline:chart-pie',
                        link: '/app-test-admin-component',
                        // meta: [Authority.ADMIN],
                    });
                }
                return checkRole;
            }

            return checkRole;
        })
    );

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard' },

    // Auth routes for guests
    {
        path: '',
        canMatch: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
            authorities: [],
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.module'
                    ).then((m) => m.AuthConfirmationRequiredModule),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.module'
                    ).then((m) => m.AuthForgotPasswordModule),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.module'
                    ).then((m) => m.AuthResetPasswordModule),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.module').then(
                        (m) => m.AuthSignInModule
                    ),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.module').then(
                        (m) => m.AuthSignUpModule
                    ),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canMatch: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
            authorities: [Authority.USER, Authority.ADMIN],
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.module').then(
                        (m) => m.AuthSignOutModule
                    ),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.module'
                    ).then((m) => m.AuthUnlockSessionModule),
            },
        ],
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
            authorities: [],
        },
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('app/modules/landing/home/home.module').then(
                        (m) => m.LandingHomeModule
                    ),
            },
        ],
    },

    // Admin routes
    {
        path: '',
        canMatch: [
            AuthGuard,
            (route: Route, segments: UrlSegment[]) => hasRole(Authority.ADMIN),
        ],
        data: {
            authorities: [Authority.ADMIN],
        },
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            // {
            //     path: 'example',
            //     loadChildren: () =>
            //         import('app/modules/admin/example/example.module').then(
            //             (m) => m.ExampleModule
            //         ),
            // },
            {
                path: 'dashboard',
                loadChildren: () =>
                    import(
                        'app/modules/admin/dashboard/dashboard.module').then(
                        (m) => m.DashboardModule),
            },
            {
                path: 'user-management',
                loadChildren: () =>
                    import(
                        'app/modules/admin/user-management/user-management.module'
                    ).then((m) => m.UserManagementModule),
            },
            {
                path: 'appointment-management',
                loadChildren: () =>
                    import(
                        'app/modules/admin/appointment-management/appointment-management.module'
                    ).then((m) => m.AppointmentManagementModule),
            },
            {
                path: 'doctor-management',
                loadChildren: () =>
                    import(
                        'app/modules/admin/doctor-management/doctor-management.module'
                    ).then((m) => m.DoctorManagementModule),
            },

            {
                path: 'patient-management',
                loadChildren: () =>
                    import(
                        'app/modules/admin/patient-management/patient-management.module'
                    ).then((m) => m.PatientManagementModule),
            },

            {
                path: 'clinic-management',
                loadChildren: () =>
                    import(
                        'app/modules/admin/clinic-management/clinic-management.module'
                    ).then((m) => m.ClinicManagementModule),
            },

            {
                path: 'product-management',
                loadChildren: () =>
                    import(
                        'app/modules/admin/inventory-management/inventory-management.module'
                    ).then((m) => m.InventoryManagementModule),
            },

            // {
            //     path: 'supplier-management',
            //     loadChildren: () =>
            //         import(
            //             'app/modules/admin/inventory-management/inventory-management.module'
            //         ).then((m) => m.InventoryManagementModule),
            // },

            // {
            //     path: 'order-management',
            //     loadChildren: () =>
            //         import(
            //             'app/modules/admin/inventory-management/inventory-management.module'
            //         ).then((m) => m.InventoryManagementModule),
            // },

            // {
            //     path: 'doctor-qualification/add-qualification',
            //     loadChildren: () =>
            //         import(
            //             'app/modules/admin/doctor-management/doctor-management.module'
            //         ).then((m) => m.DoctorManagementModule),
            // },
        ],
    },
    // user routes
    {
        path: '',
        canMatch: [
            AuthGuard,
            (route: Route, segments: UrlSegment[]) => hasRole(Authority.USER),
        ],
        data: {
            authorities: [Authority.USER],
        },
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('app/modules/admin/dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },
            {
                path: 'app-test-admin-component',
                loadChildren: () =>
                    import(
                        'app/modules/admin/test-admin-component/test-admin.module'
                    ).then((m) => m.TestAdminModule),
            },
        ],
    },
];
