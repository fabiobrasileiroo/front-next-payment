import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Método para enviar os dados do produto para a API
  sendDataToApi(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/products`, data);
  }
}
