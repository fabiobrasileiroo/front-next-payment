import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoginService } from '../services/login.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const token = this.loginService.getToken();  // Get the token from localStorage

    if (!token) {
      // If no token is found, redirect to the login page
      this.router.navigate(['/auth/sign-in']);
      return of(false);
    }

    // Validate token by calling the API
    return this.loginService.validateToken(token).pipe(
      map((isValid: boolean) => {
        if (isValid) {
          return true;  // If token is valid, allow access
        } else {
          this.router.navigate(['/auth/sign-in']);  // If token is invalid, redirect to login
          return false;
        }
      }),
      catchError((err) => {
        this.router.navigate(['/auth/sign-in']);  // On error, redirect to login page
        return of(false);
      })
    );
  }
}
