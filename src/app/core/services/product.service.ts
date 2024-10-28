import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }


  updateProducts(formData: any): Observable<any> {
    const { id } = formData
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(`${this.apiUrl}/${id}`, formData, { headers });
  }

  deleteProducts(formData: any): Observable<any> {
    const { id } = formData
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }

  deleteProductsMult(ids: number[]): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  // Envia os IDs no corpo da requisição usando a opção `body`
  return this.http.delete<any>(`${this.apiUrl}`, {
    headers,
    body: { ids }, // Passa `ids` dentro de um objeto
  });
}


  // Método para enviar os dados do produto para a API
  createProducts(data: any): Observable<any> {
    console.log("🚀 ~ ProductService ~ sendDataToApi ~ data:", data)
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(this.apiUrl, data, { headers });
  }
}
