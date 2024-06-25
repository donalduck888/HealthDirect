import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { DoctorQualificationPagination, Qualification } from 'app/model/qualification';
import { BehaviorSubject, Observable, filter, map, switchMap, take, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DoctorQualificationService {

    private _products: BehaviorSubject<Qualification[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<DoctorQualificationPagination | null> = new BehaviorSubject(null);
    private _product: BehaviorSubject<Qualification | null> = new BehaviorSubject(null);
    private _newUsers: BehaviorSubject<Qualification[] | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<Qualification[]> = new BehaviorSubject<Qualification[]>([]);

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

    get pagination$(): Observable<DoctorQualificationPagination> {
        return this._pagination.asObservable();
    }


    get product$(): Observable<Qualification> {
        return this._product.asObservable();
    }

    get products$(): Observable<Qualification[]> {
        return this._products.asObservable();
    }

    addQualification(product: Qualification): Observable<any> {
        return this._httpClient.post('/services/clinicapi/api/qualifications', product);
    }

    getAuthorities(): Observable<any> {
        return this._httpClient.get('/api/authorities');
    }

    // getUsers(page: number, size: number = 20): Observable<any> {
    //     return this._httpClient.get<Doctor>(
    //         `/services/clinicapi/api/doctors?page=${page}&size=${size}`
    //     );
    // }

    searchQualifications(query: string = 'qualificationName', page: number = 0, size: number = 5): Observable<any> {
        return this._httpClient
            .get<Qualification[]>(`/services/clinicapi/api/_search/qualifications`, {
            params: {
                page: '' + page,
                size: '' + size,
                query
            },
            observe: 'response',
            })
            .pipe(
            tap((resp: HttpResponse<Qualification[]>) => {
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


    getQualifications(query: string = 'qualificationName',page: number = 0, size: number = 5, sort: string = 'qualificationName', order: 'asc' | 'desc' | '' = 'desc'): Observable<any> {
        return this._httpClient
            .get<Qualification[]>(`/services/clinicapi/api/qualifications`, {
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
                tap((resp: HttpResponse<Qualification[]>) => {

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

    updateQualifications(product: Qualification): Observable<any> {
        return this._httpClient.put(`/services/clinicapi/api/qualifications/${product.id}`, product);
    }


    updateQualification(id: string, product: Qualification): Observable<Qualification> {
        return this.products$.pipe(
            take(1),
            switchMap(products => this._httpClient.put<Qualification>(`/services/clinicapi/api/qualifications/${id}`, product).pipe(
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

    getQualificationById(id: string): Observable<Qualification> {

        return this._httpClient.get<Qualification>(`/services/clinicapi/api/qualifications/${id}`);
    }


    deleteQualification(id: string): Observable<Qualification> {
        return this.products$.pipe(
            take(1),
            switchMap(products => this._httpClient.delete<Qualification>(`/services/clinicapi/api/qualifications/${id}`).pipe(
                map((isDeleted: Qualification) => {

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


    getQualificationList(size: number = 200): Observable<any> {
        return this._httpClient.get<Qualification[]>(`/services/clinicapi/api/qualifications`, {
            params: { size: '' + size,},
            observe: 'response',
        });
    }

}


