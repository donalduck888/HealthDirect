import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { Product, ProductManagementPagination } from 'app/model/product';
import { BehaviorSubject, Observable, filter, map, switchMap, take, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductManagementService {

    private _products: BehaviorSubject<Product[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<ProductManagementPagination | null> = new BehaviorSubject(null);
    private _product: BehaviorSubject<Product | null> = new BehaviorSubject(null);
    private _newUsers: BehaviorSubject<Product[] | null> = new BehaviorSubject(null);


    private _users: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

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

    getAllProducts(size: number = 200): Observable<any> {
        return this._httpClient.get<Product[]>(`/services/inventoryapi/api/products`, {
            params: { size: '' + size,},
            observe: 'response',    
        });
    }

    get pagination$(): Observable<ProductManagementPagination> {
        return this._pagination.asObservable();
    }


    get product$(): Observable<Product> {
        return this._product.asObservable();
    }

    get products$(): Observable<Product[]> {
        return this._products.asObservable();
    }

    addProduct(product: Product): Observable<any> {
        return this._httpClient.post('/services/inventoryapi/api/products', product);
    }

    getAuthorities(): Observable<any> {
        return this._httpClient.get('/api/authorities');
    }

    // getUsers(page: number, size: number = 20): Observable<any> {
    //     return this._httpClient.get<Doctor>(
    //         `/services/clinicapi/api/doctors?page=${page}&size=${size}`
    //     );
    // }

    searchProducts(query: string = 'name', page: number = 0, size: number = 5): Observable<any> {
        return this._httpClient
            .get<Product[]>(`/services/inventoryapi/api/_search/products`, {
            params: {
                page: '' + page,
                size: '' + size,
                query
            },
            observe: 'response',
            })
            .pipe(
            tap((resp: HttpResponse<Product[]>) => {
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


    getProducts(query: string = 'productCode',page: number = 0, size: number = 5, sort: string = 'productCode', order: 'asc' | 'desc' | '' = 'desc'): Observable<any> {
        return this._httpClient
            .get<Product[]>(`/services/inventoryapi/api/products`, {
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
                tap((resp: HttpResponse<Product[]>) => {

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

    updateProducts(product: Product): Observable<any> {
        return this._httpClient.put(`/services/inventoryapi/api/products/${product.id}`, product);
    }


    updateProduct(id: string, product: Product): Observable<Product> {
        return this.products$.pipe(
            take(1),
            switchMap(products => this._httpClient.put<Product>(`/services/inventoryapi/api/products/${id}`, product).pipe(
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

    getProductById(id: string): Observable<Product> {

        return this._httpClient.get<Product>(`/services/inventoryapi/api/products/${id}`);
    }


    deleteProduct(id: string): Observable<Product> {
        return this.products$.pipe(
            take(1),
            switchMap(products => this._httpClient.delete<Product>(`/services/inventoryapi/api/products/${id}`).pipe(
                map((isDeleted: Product) => {

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


