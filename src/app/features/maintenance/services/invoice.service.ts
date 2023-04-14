import { GetInvoice, Invoice } from './../models/invoice';
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
  getInvoices(): Observable<GetInvoice> {
    return this.http.get<GetInvoice>(
      environment.apiUrl + '/maintainance/invoices'
    );
  }
  getInvoiceByPage(page: number): Observable<GetInvoice> {
    return this.http.get<GetInvoice>(
      environment.apiUrl + '/maintainance/invoices?page=' + page
    );
  }
  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(
      environment.apiUrl + '/maintainance/invoices/' + id
    );
  }
}
