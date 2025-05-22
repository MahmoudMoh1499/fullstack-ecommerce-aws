// src/app/products/product.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsService } from './products.service';

@Injectable({ providedIn: 'root' })
export class ProductResolver implements Resolve<any> {
  constructor(private productsService: ProductsService) { }

  resolve(): Observable<any> | Promise<any> | any {
    return this.productsService.getProducts();
  }
}
