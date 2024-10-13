import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token'); // Ensure the correct key is used

    // Set the Authorization header with the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,  // Add Bearer if token is JWT
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }
}
