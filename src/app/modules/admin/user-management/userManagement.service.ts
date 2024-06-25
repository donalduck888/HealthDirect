import { Injectable } from '@angular/core';
import { User, UserManagementPagination } from 'app/core/user/user.types';
import { BehaviorSubject, Observable, catchError, filter, map, of, switchMap, take, tap } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class UserMangementService {
    // private _users: User[];
    private _users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
    private _pagination: BehaviorSubject<UserManagementPagination | null> = new BehaviorSubject(null);
    private _newUsers: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
    private _products: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
    private _product: BehaviorSubject<User | null> = new BehaviorSubject(null);

    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService
    ) {}

    test() {
        console.log('hello');
    }

    _getUser() {
        return this._users;
    }

    createUser(user: User): Observable<any> {
        return this._httpClient.post('/api/admin/users', user);
    }

    
    newCreateUser(user: User): Observable<any> {
        return this._httpClient.post('/services/gateway/api/admin/users', user); 
    }


    getAuthorities(): Observable<any> {
        return this._httpClient.get('/api/authorities');
    }

    // getUsers(page: number, size: number = 20): Observable<any> {
    //     return this._httpClient.get<User>(
    //         `api/admin/users?page=${page}&size=${size}`
    //     );
    // }

    getUserByUsername(login: string): Observable<User> { 
        return this._httpClient.get<User>(`api/admin/users/${login}`); 
      }

    updateUsers(user: User): Observable<any> {
        return this._httpClient.put('/services/gateway/api/admin/users', user); 
    }

    get pagination$(): Observable<UserManagementPagination> {
        return this._pagination.asObservable();
    }


    searchUsers(query: string = 'login', page: number = 0, size: number = 5): Observable<any> {
        return this._httpClient
            .get<User[]>(`api/admin/users`, {
            params: {
                page: '' + page,
                size: '' + size,
                query
            },
            observe: 'response',
            })
            .pipe(
            tap((resp: HttpResponse<User[]>) => {
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



    getUsers(query: string = 'login',page: number = 0, size: number = 5, sort: string = 'login', order: 'asc' | 'desc' | '' = 'desc'): Observable<any> {
        return this._httpClient
            .get<User[]>(`api/admin/users`, {
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
                tap((resp: HttpResponse<User[]>) => {

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


    updateUser(product: User): Observable<User> {
        return this.products$.pipe(
            take(1),
            switchMap(products => this._httpClient.put<User>(`/api/admin/users/`, product).pipe(
                map((updatedProduct) => {
    
                    // Find the index of the updated product
                    const index = products.findIndex(item => item.id === product.id);
    
                    // Update the product
                    products[index] = updatedProduct;
    
                    // Update the products
                    this._products.next(products);
    
                    // Return the updated product
                    return updatedProduct;
                }),
                switchMap(updatedProduct => this.product$.pipe(
                    take(1),
                    filter(item => item && item.id === product.id),
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

    get products$(): Observable<User[]> {
        return this._products.asObservable();
    }

    get product$(): Observable<User> {
        return this._product.asObservable();
    }
}
