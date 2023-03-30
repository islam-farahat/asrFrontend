import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(
      environment.apiUrl + '/maintainance/customers'
    );
  }
  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(
      environment.apiUrl + '/maintainance/customers',
      customer
    );
  }
}
