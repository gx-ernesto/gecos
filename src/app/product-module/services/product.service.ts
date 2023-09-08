import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Product } from '../models/product.model';

const API_URL = environment.BASE_URL + 'product/';
const FAKE_PRODUCTS = ["Televisor LED", "Teléfono inteligente", "Laptop", "Cámara digital", "Refrigeradora", "Aspiradora", "Cafetera", "Bicicleta de montaña", "Altavoz Bluetooth", "Auriculares inalámbricos"];

@Injectable()
export class ProductService {

  constructor(
    private http: HttpClient,
  ) {}

  getAll(filter: string): Observable<Product[]> {
    const options = { params: { filter }};
    return this.http.get<Product[]>(API_URL, options).pipe(retry(3));
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(API_URL + id).pipe(retry(3));
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(API_URL, product).pipe(retry(3));
  }

  update(product: Product): Observable<Product> {
    return this.http.put<Product>(API_URL, product).pipe(retry(3));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(API_URL + id).pipe(retry(3));
  }

  seed(): Observable<void> {
    const params = { quantity: 10, randomNames: FAKE_PRODUCTS};
    return this.http.post<void>(API_URL + 'seed', params).pipe(retry(3));
  }

}
