import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(environment.apiUrl + '/parts');
  }
  getProductByBarcode(barcode: string): Observable<Product> {
    return this.http.get<Product>(
      environment.apiUrl + '/get-products-by-barcode/' + barcode
    );
  }
}
