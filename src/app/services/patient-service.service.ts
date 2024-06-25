import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { Patient, PatientManagementPagination } from 'app/model/patient';
import { BehaviorSubject, Observable, filter, map, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientManagementService {

    private _products: BehaviorSubject<Patient[] | null> = new BehaviorSubject(null);
    private _product: BehaviorSubject<Patient | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<PatientManagementPagination | null> = new BehaviorSubject(null);
    private _newUsers: BehaviorSubject<Patient[] | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);

    // private _users: Patient[];

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

    get product$(): Observable<Patient> {
        return this._product.asObservable();
    }

    get products$(): Observable<Patient[]> {
        return this._products.asObservable();
    }

    createPatient(patient: Patient): Observable<Patient> {
        return this._httpClient.post('/services/clinicapi/api/patients', patient); 
    }

    getAuthorities(): Observable<any> {
        return this._httpClient.get('/api/authorities');
    }

    // getPatients(page: number, size: number = 20): Observable<any> {
    //     return this._httpClient.get<Patient>(
    //         `/services/patientapi/api/patients?page=${page}&size=${size}`
    //     );
    // }



    searchPatients(query: string = 'patientName', page: number = 0, size: number = 5): Observable<any> {
        return this._httpClient
            .get<Patient[]>(`/services/clinicapi/api/patients`, {
            params: {
                page: '' + page,
                size: '' + size,
                query
            },
            observe: 'response',
            })
            .pipe(
            tap((resp: HttpResponse<Patient[]>) => {
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


    getPatients(query: string = 'patientName',page: number = 0, size: number = 5, sort: string = 'patientName', order: 'asc' | 'desc' | '' = 'desc'): Observable<any> {
        return this._httpClient
            .get<Patient[]>(`/services/clinicapi/api/patients`, {
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
                tap((resp: HttpResponse<Patient[]>) => {

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


    get pagination$(): Observable<PatientManagementPagination> {
        return this._pagination.asObservable();
    }




    updatePatients(patient: Patient): Observable<any> {
        return this._httpClient.put(`/services/clinicapi/api/patients/${patient.id}`, patient);
    }


    updatePatient(id: string, product: Patient): Observable<Patient> {
        return this.products$.pipe(
            take(1),
            switchMap(products => this._httpClient.put<Patient>(`/services/clinicapi/api/patients/${id}`, product).pipe(
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

    getPatientById(id: string): Observable<Patient> { 

        return this._httpClient.get<Patient>(`/services/clinicapi/api/patients/${id}`);
    }


    deletePatient(id: string): Observable<Patient>
    {
        return this.products$.pipe(
            take(1),
            switchMap(products => this._httpClient.delete<Patient>(`/services/clinicapi/api/patients/${id}`).pipe(
                map((isDeleted: Patient) => {

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
