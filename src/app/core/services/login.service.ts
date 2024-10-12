/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly API_URL = 'https://back-next-payment.onrender.com/auth/login';
  

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    console.log("🚀 ~ LoginService ~ login ~ email:", email)
    console.log("🚀 ~ LoginService ~ login ~ password:", password)

    return this.http.post(this.API_URL, { email, password });
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token); // Armazena o token no localStorage
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
