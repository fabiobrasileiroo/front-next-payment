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
  private mercadoPagoApiUrl = `${environment.mercadoPagoApiUrl}`; // URL da API do Mercado Pago
  private acessTokenMercadoPago = `${environment.acessToken}`

  constructor(private http: HttpClient) {}

  createPayment(paymentData: any): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(this.apiUrl, paymentData, { headers });
  }
  // Novo método para verificar status de pagamento antigo
  // checkPaymentStatus(paymentId: string): Observable<any> {
  //   const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });

  //   return this.http.get<any>(`${this.apiUrl}/check-payment-status/${paymentId}`, { headers });
  // }

   // Método para verificar o status do pagamento
  checkPaymentStatus(paymentId: string): Observable<any> {

    if (!this.acessTokenMercadoPago) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.acessTokenMercadoPago}`,
    });

    // Faz a chamada à API do Mercado Pago
    return this.http.get(`${this.mercadoPagoApiUrl}/${paymentId}`, { headers });
  }
}
