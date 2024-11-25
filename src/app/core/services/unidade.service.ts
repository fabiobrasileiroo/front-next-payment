import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UnidadeService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  /**
   * Obter todas as unidades
   * Endpoint: GET /units
   */
  getUnidades(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/units`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Obter unidade por ID
   * Endpoint: GET /units/:id
   */
  getUnidadeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/units/${id}`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Criar uma nova unidade
   * Endpoint: POST /create-unit
   */
  criarUnidade(data: { name: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/units`, data, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Atualizar unidade existente
   * Endpoint: PUT /units/:id
   */
  atualizarUnidade(id: number, data: { name: string; pixKey?: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/units/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Deletar unidade
   * Endpoint: DELETE /units/:id
   */
  deletarUnidade(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/units/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
