import { Component, Input } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ImageModule } from 'primeng/image';
import { PaymentService } from 'src/app/core/services/payment-pix.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nft-header',
  templateUrl: './nft-header.component.html',
  standalone: true,
  imports: [DrawerModule,OverlayBadgeModule, ButtonModule, CurrencyPipe, NgIf, NgFor, ImageModule],
})
export class NftHeaderComponent {
  visible: boolean = false;
  @Input() selectedProducts: any[] = []; // Recebe os produtos selecionados
  updatedProducts: any[] = []; // Array para manter os dados atualizados
  totalAmount: number = 0; // Soma total dos produtos no carrinho

  constructor(private paymentService: PaymentService, private router: Router) { }

  openDrawer() {
    // Inicializa `quantityItem` para todos os produtos selecionados
    this.updatedProducts = this.selectedProducts.map(product => ({
      ...product,
      quantityItem: product.quantityItem || 1, // Começa com 1 unidade por padrão
    }));
    this.calculateTotalAmount(); // Atualiza o valor total
    this.visible = true;
  }

  closeDrawer() {
    this.visible = false;
  }

  updateQuantity(product: any, quantity: number) {
    if (quantity < 1) {
      alert(`A quantidade mínima para ${product.name} é 1 unidade.`);
      product.quantityItem = 1; // Define a quantidade mínima
    } else if (quantity > product.quantity) {
      alert(`Você não pode adicionar mais do que ${product.quantity} unidades de ${product.name}.`);
      product.quantityItem = product.quantity; // Define a quantidade máxima
    } else {
      product.quantityItem = quantity; // Atualiza a quantidade
    }

    this.calculateTotalAmount(); // Recalcula o total ao atualizar a quantidade
  }

  onQuantityChange(product: any, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const newValue = +inputElement.value;
      if (!isNaN(newValue)) {
        this.updateQuantity(product, newValue);
      } else {
        console.warn('Número inválido inserido.');
      }
    }
  }

  increaseQuantity(product: any) {
    console.log("🚀 ~ NftHeaderComponent ~ increaseQuantity ~ product:", product)
    this.updateQuantity(product, product.quantityItem + 1);
  }

  decreaseQuantity(product: any) {
    this.updateQuantity(product, product.quantityItem - 1);
  }

  calculateTotalAmount() {
    this.totalAmount = this.updatedProducts.reduce((sum, product) => {
      return sum + product.price * product.quantityItem;
    }, 0);
  }

  processPayment() {
    if (this.selectedProducts.length === 0) {
      alert('Por favor, selecione pelo menos um produto!');
      return;
    }

    // Construir lista de produtos com ID e quantidade
    const productsToPay = this.selectedProducts.map(product => ({
      id: product.id,
      quantity: product.selectedQuantity,
    }));

    const paymentData = {
      transaction_amount: this.totalAmount, // Total calculado
      description: 'Pagamento dos produtos selecionados',
      payment_method_id: 'pix',
      payer: { email: 'usuario@exemplo.com' },
      // products: productsToPay, // Adicionando lista de produtos ao paymentData
    };

    // this.paymentService.createPayment(paymentData).subscribe(
    //   (response: any) => {
    //     const paymentUrl = response.point_of_interaction.transaction_data.ticket_url;
    //     window.open(paymentUrl, '_blank');
    //   },
    //   (error: any) => {
    //     console.error('Erro no pagamento:', error);
    //   }
    // );

    this.paymentService.createPayment(paymentData).subscribe(
      (response: any) => {
        const paymentUrl = response.point_of_interaction.transaction_data.ticket_url;

        console.log("🚀 ~ NftHeaderComponent ~ processPayment ~ paymentUrl:", paymentUrl)
        // Navigate to the PaymentPixComponent with paymentUrl as state
        this.router.navigate(['/products/payment-pix', {
          paymentUrl,
        }]);
      },
      (error: any) => {
        console.error('Error creating payment:', error);
      }
    );
  }

}
