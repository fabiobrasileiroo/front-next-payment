import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PasswordResetService {
  private readonly API_URL = `${environment.apiUrl}/auth/reset-password`;

  constructor(private http: HttpClient) {}

  // Method to reset the password, including token and email
  resetPassword(payload: { email: string; token: string; newPassword: string }): Observable<any> {
    return this.http.post(this.API_URL, payload);
  }
}
