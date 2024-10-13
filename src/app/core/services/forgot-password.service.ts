import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  private readonly API_URL = `${environment.apiUrl}/auth/forgot-password`;

  constructor(private http: HttpClient) {}

  // Method to send forgot password request
  sendResetLink(email: string): Observable<any> {
    return this.http.post(this.API_URL, { email });
  }
}
