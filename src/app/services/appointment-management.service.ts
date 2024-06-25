import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Appointment, AppointmentManagementPagination } from 'app/model/appointment';
import { BehaviorSubject, Observable, Subject, map, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
}) 
export class AppointmentManagementService {
  events: any;
  private _products: BehaviorSubject<Appointment[] | null> = new BehaviorSubject(null);
  private _pagination: BehaviorSubject<AppointmentManagementPagination | null> = new BehaviorSubject(null);
  private _product: BehaviorSubject<Appointment | null> = new BehaviorSubject(null);
  private _users: BehaviorSubject<Appointment[]> = new BehaviorSubject<Appointment[]>([]);
  onEventsUpdated: Subject<any>;

  constructor(private _httpClient: HttpClient) {
  }

  _getUser() {
    return this._users;
  }

  get pagination$(): Observable<AppointmentManagementPagination> {
    return this._pagination.asObservable();
  }

  get product$(): Observable<Appointment> {
    return this._product.asObservable(); 
  }

  get products$(): Observable<Appointment[]> {
    return this._products.asObservable();
  }

  createUser(user: Appointment): Observable<any> {
    return this._httpClient.post('/services/clinicapi/api/appoinments', user);   
  }

  getUsers(): Observable<any> { 
    return this._httpClient
      .get<Appointment[]>(`/services/clinicapi/api/appoinments`, {
        observe: 'response',  
      })
  }

  searchAppointments(query: string , page: number = 0, size: number = 100 ): Observable<HttpResponse<Appointment[]>> {
    return this._httpClient
        .get<Appointment[]>(`/services/clinicapi/api/_search/appoinments`, {
        params: {
            page: '' + page,
            size: '' + size,
            query,
            sort:['_id,desc']
        },
        observe: 'response',
        });
}

  // getEvents(): Promise<any>
  //   {
  //       return new Promise((resolve, reject) => {

  //           this._httpClient.get('/services/clinicapi/api/appoinments')
  //               .subscribe((response: any) => {
  //                   this.events = response.data;
  //                   this.onEventsUpdated.next(this.events);
  //                   resolve(this.events);
  //               }, reject);
  //       });
  //   }

  updateApp(user: Appointment): Observable<any> {
    return this._httpClient.put(`/services/clinicapi/api/appoinments/${user.id}`, user);
  }

  getAppById(id: string): Observable<Appointment> {

    return this._httpClient.get<Appointment>(`/services/clinicapi/api/appoinments/${id}`);
  }


  deleteProduct(id: string): Observable<Appointment> {

    return this.products$.pipe(
      take(1),
      switchMap(products => this._httpClient.delete<Appointment>(`/services/clinicapi/api/appoinments/${id}`).pipe(
        map((isDeleted: Appointment) => {

          const index = products.findIndex(item => item.id === id);

          products.splice(index, 1);

          this._products.next(products);

          return isDeleted;
        })
      ))
    );
  }



}
