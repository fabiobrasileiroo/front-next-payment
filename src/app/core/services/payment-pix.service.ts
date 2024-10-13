// payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/api/payments`;

  constructor(private http: HttpClient) {}

  createPayment(paymentData: any): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(this.apiUrl, paymentData, { headers });
  }
}
