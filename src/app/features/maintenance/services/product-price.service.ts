import { ProductPrice } from './../models/product-price';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductPriceService {
  constructor(private http: HttpClient) {}
  getProductPrice(id: number): Observable<ProductPrice> {
    return this.http.get<ProductPrice>(
      environment.apiUrl + '/maintainance/prices/' + id
    );
  }
}
