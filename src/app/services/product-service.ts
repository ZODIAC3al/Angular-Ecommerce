import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IProducts } from '../../models/iproducts';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseURL = 'http://localhost:3000/products';

  constructor(private httpClient: HttpClient) {}

  getAllProducts(): Observable<IProducts[]> {
    return this.httpClient.get<IProducts[]>(this.baseURL);
  }

  postProduct(product: IProducts): Observable<IProducts> {
    return this.httpClient.post<IProducts>(this.baseURL, product);
  }

  deleteProduct(id: number | string) {
    return this.httpClient.delete(`${this.baseURL}/${id}`);
  }

  updateProduct(id: number | string, product: IProducts) {
    return this.httpClient.put(`${this.baseURL}/${id}`, product);
  }
}
