import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Barcode } from './../models/barcode';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BarcodeService {
  constructor(private http: HttpClient) {}
  generateQRCode(barcode: Barcode): Observable<Barcode> {
    return this.http.post<Barcode>(
      environment.apiUrl + '/generate-qr',
      barcode,
      {
        responseType: 'base64' as 'json',
      }
    );
  }
}
