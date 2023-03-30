import { Invoice } from './../models/invoice';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  constructor(private http: HttpClient) {}
  create(invoice: Invoice) {
    return this.http.post(
      environment.apiUrl + '/maintainance/invoices/create',
      invoice
    );
  }
  getInvoices(obj: any): Observable<Invoice[]> {
    return this.http.post<Invoice[]>(
      environment.apiUrl + '/maintainance/invoices',
      obj
    );
  }
}
