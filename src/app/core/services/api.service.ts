import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
  };

  constructor(private httpService: HttpClient) {}

  getIPInfo(): Observable<any> {
    return this.httpService.get('https://ipapi.co/json/', this.httpOptions).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => new Error('Problem with IP info'));
      }),
    );
  }
}