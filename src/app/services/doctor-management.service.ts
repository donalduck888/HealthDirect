import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { Doctor, DoctorManagementPagination } from 'app/model/doctor';
import { BehaviorSubject, Observable, filter, map, switchMap, take, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DoctorManagementService {

    private _products: BehaviorSubject<Doctor[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<DoctorManagementPagination | null> = new BehaviorSubject(null);
    private _product: BehaviorSubject<Doctor | null> = new BehaviorSubject(null);
    private _newUsers: BehaviorSubject<Doctor[] | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<Doctor[]> = new BehaviorSubject<Doctor[]>([]);

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

    get pagination$(): Observable<DoctorManagementPagination> {
        return this._pagination.asObservable();
    }


    get product$(): Observable<Doctor> {
        return this._product.asObservable();
    }

    get products$(): Observable<Doctor[]> {
        return this._products.asObservable();
    }

    createUser(user: Doctor): Observable<any> {
        return this._httpClient.post('/services/clinicapi/api/doctors', user);
    }

    getAuthorities(): Observable<any> {
        return this._httpClient.get('/api/authorities');
    }

    getDoctors(size: number = 200): Observable<any> {
        return this._httpClient.get<Doctor[]>(`/services/clinicapi/api/doctors`, {
            params: { size: '' + size,},
            observe: 'response',    
        });
    }

    searchUsers(query: string = '', page: number = 0, size: number = 5): Observable<any> {
        return this._httpClient
            .get<Doctor[]>(`/services/clinicapi/api/_search/doctors`, {
                params: {
                    page: '' + page,
                    size: '' + size,
                    query:query+'*'
                },
                observe: 'response',
            })
            .pipe(
                tap((resp: HttpResponse<Doctor[]>) => {
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


    getUsers(query: string = 'name', page: number = 0, size: number = 5, sort: string = 'name', order: 'asc' | 'desc' | '' = 'desc'): Observable<any> {
        return this._httpClient
            .get<Doctor[]>(`/services/clinicapi/api/doctors`, {
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
                tap((resp: HttpResponse<Doctor[]>) => {

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




    updateDoctors(doctor: Doctor): Observable<any> {
        return this._httpClient.put(`/services/clinicapi/api/doctors/${doctor.id}`, doctor);
    }


    updateDoctor(id: string, product: Doctor): Observable<Doctor> {
        return this.products$.pipe(
            take(1),
            switchMap(products => this._httpClient.put<Doctor>(`/services/clinicapi/api/doctors/${id}`, product).pipe(
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

    getDoctorById(id: string): Observable<Doctor> {

        return this._httpClient.get<Doctor>(`/services/clinicapi/api/doctors/${id}`);
    }


    deleteProduct(id: string): Observable<Doctor> {
        return this.products$.pipe(
            take(1),
            switchMap(products => this._httpClient.delete<Doctor>(`/services/clinicapi/api/doctors/${id}`).pipe(
                map((isDeleted: Doctor) => {

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


