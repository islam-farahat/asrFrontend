import { Model } from './../models/model';
import { Observable } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  constructor(private http: HttpClient) {}
  getModelsNames(): Observable<Model[]> {
    return this.http.get<Model[]>(environment.apiUrl + '/models');
  }
  addModelName(model: Model): Observable<Model> {
    return this.http.post<Model>(environment.apiUrl + '/models', model);
  }
}
