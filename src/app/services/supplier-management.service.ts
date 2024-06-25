import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { Supplier, SupplierManagementPagination } from 'app/model/supplier';
import { BehaviorSubject, Observable, filter, map, switchMap, take, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SupplierManagementService {

    private _suppliers: BehaviorSubject<Supplier[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<SupplierManagementPagination | null> = new BehaviorSubject(null);
    private _supplier: BehaviorSubject<Supplier | null> = new BehaviorSubject(null);
    private _newUsers: BehaviorSubject<Supplier[] | null> = new BehaviorSubject(null);


    private _users: BehaviorSubject<Supplier[]> = new BehaviorSubject<Supplier[]>([]);

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

    getAllSuppliers(size: number = 200): Observable<any> {
        return this._httpClient.get<Supplier[]>(`/services/inventoryapi/api/suppliers`, {
            params: { size: '' + size,},
            observe: 'response',
        });
    }

    get pagination$(): Observable<SupplierManagementPagination> {
        return this._pagination.asObservable();
    }


    get supplier$(): Observable<Supplier> {
        return this._supplier.asObservable();
    }

    get suppliers$(): Observable<Supplier[]> {
        return this._suppliers.asObservable();
    }

    addSupplier(supplier: Supplier): Observable<any> {
        return this._httpClient.post('/services/inventoryapi/api/suppliers', supplier);
    }

    getAuthorities(): Observable<any> {
        return this._httpClient.get('/api/authorities');
    }

    // getUsers(page: number, size: number = 20): Observable<any> {
    //     return this._httpClient.get<Doctor>(
    //         `/services/clinicapi/api/doctors?page=${page}&size=${size}`
    //     );
    // }

    searchSuppliers(query: string = 'name', page: number = 0, size: number = 5): Observable<any> {
        return this._httpClient
            .get<Supplier[]>(`/services/inventoryapi/api/_search/suppliers`, {
            params: {
                page: '' + page,
                size: '' + size,
                query
            },
            observe: 'response',
            })
            .pipe(
            tap((resp: HttpResponse<Supplier[]>) => {
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


    getSuppliers(query: string = 'name',page: number = 0, size: number = 5, sort: string = 'name', order: 'asc' | 'desc' | '' = 'desc'): Observable<any> {
        return this._httpClient
            .get<Supplier[]>(`/services/inventoryapi/api/suppliers`, {
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
                tap((resp: HttpResponse<Supplier[]>) => {

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

    updateSuppliers(supplier: Supplier): Observable<any> {
        return this._httpClient.put(`/services/inventoryapi/api/products/${supplier.id}`, supplier);
    }


    updateSupplier(id: string, supplier: Supplier): Observable<Supplier> {
        return this.suppliers$.pipe(
            take(1),
            switchMap(suppliers => this._httpClient.put<Supplier>(`/services/inventoryapi/api/suppliers/${id}`, supplier).pipe(
                map((updatedSupplier) => {

                    // Find the index of the updated product
                    const index = suppliers.findIndex(supplier => supplier.supId === id);

                    // Update the product
                    suppliers[index] = updatedSupplier;

                    // Update the products
                    this._suppliers.next(suppliers);

                    // Return the updated product
                    return updatedSupplier;
                }),
                switchMap(updatedSupplier => this.supplier$.pipe(
                    take(1),
                    filter(item => item && item.supId === id),
                    tap(() => {

                        // Update the product if it's selected
                        this._supplier.next(updatedSupplier);

                        // Return the updated product
                        return updatedSupplier;
                    })
                ))
            ))
        );
    }

    getSupplierById(id: string): Observable<Supplier> {

        return this._httpClient.get<Supplier>(`/services/inventoryapi/api/suppliers/${id}`);
    }


    deleteSupplier(id: string): Observable<Supplier> {
        return this.suppliers$.pipe(
            take(1),
            switchMap(suppliers => this._httpClient.delete<Supplier>(`/services/inventoryapi/api/suppliers/${id}`).pipe(
                map((isDeleted: Supplier) => {

                    // Find the index of the deleted product
                    const index = suppliers.findIndex(item => item.supId === id);

                    // Delete the product
                    suppliers.splice(index, 1);

                    // Update the products
                    this._suppliers.next(suppliers);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }
}
