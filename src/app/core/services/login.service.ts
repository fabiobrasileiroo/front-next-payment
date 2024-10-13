import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly API_URL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // Login method (same as before)
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, { email, password });
  }

  // Save token in localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Remove token (for logout)
  logout(): void {
    localStorage.removeItem('token');
  }

  // Method to validate token by calling the API
  validateToken(token: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.API_URL}/validate-token`, { token }).pipe(
      catchError(() => of(false))  // In case of an error, return false
    );
  }
}
