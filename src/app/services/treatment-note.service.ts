import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { TreatmentNote, TreatmentNotePagination } from 'app/model/treatmentnote';
import { BehaviorSubject, Observable, filter, map, switchMap, take, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TreatmentNoteService {

    private _products: BehaviorSubject<TreatmentNote[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<TreatmentNotePagination | null> = new BehaviorSubject(null);
    private _product: BehaviorSubject<TreatmentNote | null> = new BehaviorSubject(null);
    private _newUsers: BehaviorSubject<TreatmentNote[] | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<TreatmentNote[]> = new BehaviorSubject<TreatmentNote[]>([]);

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

    get pagination$(): Observable<TreatmentNotePagination> {
        return this._pagination.asObservable();
    }


    get product$(): Observable<TreatmentNote> {
        return this._product.asObservable();
    }

    get products$(): Observable<TreatmentNote[]> {
        return this._products.asObservable();
    }

    createUser(user: TreatmentNote): Observable<any> {
        return this._httpClient.post('/services/clinicapi/api/treatment-notes', user);
    }

    getAuthorities(): Observable<any> {
        return this._httpClient.get('/api/authorities');
    }

    getDoctors(size: number = 200): Observable<any> {
        return this._httpClient.get<TreatmentNote[]>(`/services/clinicapi/api/treatment-notes`, {
            params: { size: '' + size, },
            observe: 'response',
        });
    }

    searchUsers(query: string = 'name', page: number = 0, size: number = 5): Observable<any> {
        return this._httpClient
            .get<TreatmentNote[]>(`/services/clinicapi/api/_search/treatment-notes`, {
                params: {
                    page: '' + page,
                    size: '' + size,
                    query
                },
                observe: 'response',
            })
            .pipe(
                tap((resp: HttpResponse<TreatmentNote[]>) => {
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
            .get<TreatmentNote[]>(`/services/clinicapi/api/treatment-notes`, {
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
                tap((resp: HttpResponse<TreatmentNote[]>) => {

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




    updateDoctors(treatment: TreatmentNote): Observable<any> {
        return this._httpClient.put(`/services/clinicapi/api/treatment-notes/${treatment.id}`, treatment);
    }


    updateDoctor(id: string, product: TreatmentNote): Observable<TreatmentNote> {
        return this.products$.pipe(
            take(1),
            switchMap(products => this._httpClient.put<TreatmentNote>(`/services/clinicapi/api/treatment-notes/${id}`, product).pipe(
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

    getDoctorById(id: string): Observable<TreatmentNote> {

        return this._httpClient.get<TreatmentNote>(`/services/clinicapi/api/treatment-notes/${id}`);
    }


    deleteProduct(id: string): Observable<TreatmentNote> {
        return this.products$.pipe(
            take(1),
            switchMap(products => this._httpClient.delete<TreatmentNote>(`/services/clinicapi/api/treatment-notes/${id}`).pipe(
                map((isDeleted: TreatmentNote) => {

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
