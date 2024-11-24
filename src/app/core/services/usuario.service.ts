import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Usuario {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  role?: 'USER' | 'ADMIN'; // Tipo consistente
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Token não encontrado no localStorage.');
    }

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    });
  }

  /**
   * Obter todos os usuários
   * Endpoint: GET /users
   */
  getUsuarios(): Observable<{ users: Usuario[] }> {
    return this.http.get<{ users: Usuario[] }>(`${this.apiUrl}/users`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Obter usuário por ID
   * Endpoint: GET /users/:id
   */
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/users/${id}`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Criar um novo usuário
   * Endpoint: POST /users
   */
  criarUsuario(data: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/users`, data, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Atualizar usuário existente
   * Endpoint: PUT /users/:id
   */
  atualizarUsuario(data: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/users/${data.id}`, data, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Deletar usuário
   * Endpoint: DELETE /users/:id
   */
  deletarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
