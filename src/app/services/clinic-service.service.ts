import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { Clinic, ClinicManagementPagination } from 'app/model/clinic';
import { BehaviorSubject, Observable, filter, map, switchMap, take, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ClinicServiceService {

    private _products: BehaviorSubject<Clinic[] | null> = new BehaviorSubject(null);
    private _product: BehaviorSubject<Clinic | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<ClinicManagementPagination | null> = new BehaviorSubject(null);
    private _newUsers: BehaviorSubject<Clinic[] | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<Clinic[]> = new BehaviorSubject<Clinic[]>([]);
    // pagination$: any;

    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService
    ) { }

    test() {
        console.log('hello');
    }

    _getUser() {
        return this._users;
    }

    get product$(): Observable<Clinic> {
        return this._product.asObservable();
    }

    get products$(): Observable<Clinic[]> {
        return this._products.asObservable();
    }

    addClinic(clinic: Clinic): Observable<any> {
        return this._httpClient.post('/services/clinicapi/api/clinics', clinic);
    }

    getAuthorities(): Observable<any> {
        return this._httpClient.get('/api/authorities');
    }

    // getClinics(page: number, size: number = 20): Observable<any> {
    //     return this._httpClient.get<Clinic>(
    //         `/services/clinicapi/api/clinics?page=${page}&size=${size}`
    //     );
    // }

    getClinicss(size: number = 200): Observable<any> {
        return this._httpClient.get<Clinic[]>(`/services/clinicapi/api/clinics`, {
            params: { size: '' + size,},
            observe: 'response',    
        });
    }


    searchClinics(query: string = 'clinicName', page: number = 0, size: number = 5): Observable<any> {
        return this._httpClient
            .get<Clinic[]>(`/services/clinicapi/api/_search/clinics`, {
            params: {
                page: '' + page,
                size: '' + size,
                query
            },
            observe: 'response',
            })
            .pipe(
            tap((resp: HttpResponse<Clinic[]>) => {
                const options = {
                    page: page,
                    size: size,
                    length: parseInt(resp.headers.get('X-Total-Count')),
                    endIndex: 0,
                    lastPage: 0,
                    startIndex: 0,
                };

                this._users.next(resp.body); // Update the _users subject instead of _newUsers
                this._pagination.next(options);
            })
            );
    }




    getClinics(query: string = 'clinicName',page: number = 0, size: number = 5, sort: string = 'clinicName', order: 'asc' | 'desc' | '' = 'desc'): Observable<any> {
        return this._httpClient
            .get<Clinic[]>(`/services/clinicapi/api/clinics`, {
                params: {
                    page: '' + page,
                    size: '' + size,
                    sort,
                    order,
                    query
                },
                observe: 'response',
            })
            .pipe(
                tap((resp: HttpResponse<Clinic[]>) => {

                    const options = {
                        page: page,
                        size: size,
                        length: parseInt(resp.headers.get('X-Total-Count')),
                        endIndex: 0,
                        lastPage: 0,
                        startIndex: 0,
                    };

                    this._newUsers.next(resp.body);
                    this._pagination.next(options);
                })
            );
    }

    updateClinics(doctor: Clinic): Observable<any> {
        return this._httpClient.put(`/services/clinicapi/api/clinics/${doctor.id}`, doctor); 
    }


    get pagination$(): Observable<ClinicManagementPagination> {
        return this._pagination.asObservable();
    }


    updateClinic(id: string, product: Clinic): Observable<Clinic> {
        return this.products$.pipe(
            take(1),
            switchMap(products => this._httpClient.put<Clinic>(`/services/clinicapi/api/clinics/${id}`, product).pipe(
                map((updatedProduct) => {

                    // Find the index of the updated product
                    const index = products.findIndex(item => item.id === id);

                    // Update the product
                    products[index] = updatedProduct;

                    // Update the products
                    this._products.next(products);

                    // Return the updated product
                    return updatedProduct;
                }),
                switchMap(updatedProduct => this.product$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the product if it's selected
                        this._product.next(updatedProduct);

                        // Return the updated product
                        return updatedProduct;
                    })
                ))
            ))
        );
    }

    getClinicById(id: string): Observable<Clinic> {

        return this._httpClient.get<Clinic>(`/services/clinicapi/api/clinics/${id}`);
    }


    deleteProduct(id: string): Observable<Clinic>
    {
        return this.products$.pipe(
            take(1),
            switchMap(products => this._httpClient.delete<Clinic>(`/services/clinicapi/api/clinics/${id}`).pipe(
                map((isDeleted: Clinic) => {

                    // Find the index of the deleted product
                    const index = products.findIndex(item => item.id === id);

                    // Delete the product
                    products.splice(index, 1);

                    // Update the products
                    this._products.next(products);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }
}
