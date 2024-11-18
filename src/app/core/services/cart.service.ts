import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private selectedProductsSubject = new BehaviorSubject<any[]>([]);
  selectedProducts$ = this.selectedProductsSubject.asObservable();

  // Obtém a lista atual de produtos no carrinho
  get selectedProducts(): any[] {
    return this.selectedProductsSubject.getValue();
  }

  // Adiciona um produto ao carrinho
  addProduct(product: any): void {
    const currentProducts = this.selectedProducts;
    const index = currentProducts.findIndex((p) => p.id === product.id);

    if (index === -1) {
      currentProducts.push({ ...product, quantity: 1 });
    } else {
      currentProducts[index].quantity += 1; // Incrementa a quantidade
    }
    this.selectedProductsSubject.next([...currentProducts]); // Atualiza o BehaviorSubject
  }

  // Remove um produto do carrinho
  removeProduct(productId: number): void {
    const updatedProducts = this.selectedProducts.filter((p) => p.id !== productId);
    this.selectedProductsSubject.next(updatedProducts); // Atualiza o BehaviorSubject
  }

  // Limpa o carrinho
  clearCart(): void {
    this.selectedProductsSubject.next([]); // Esvazia o carrinho
  }
}
