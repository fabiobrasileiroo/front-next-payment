import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { PaymentService } from 'src/app/core/services/payment-pix.service';
import { EmblaCarouselDirective, EmblaCarouselType } from 'embla-carousel-angular';
import { NftHeaderComponent } from '../../components/nft/nft-header/nft-header.component';
import { CommonModule, CurrencyPipe, DatePipe, NgFor, NgStyle } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-nft',
  templateUrl: './nft.component.html',
  standalone: true,
  imports: [
    NgFor,
    NftHeaderComponent,
    CurrencyPipe,
    NgStyle,
    DatePipe,
    CommonModule,
    EmblaCarouselDirective,
    SkeletonModule,
    ImageModule
  ],
  styleUrls: ['./produtos.component.css'],
})
export class NftComponent implements OnInit, AfterViewInit {
  @ViewChild(EmblaCarouselDirective) emblaRef: EmblaCarouselDirective | undefined;
  @ViewChild(NftHeaderComponent) nftHeader!: NftHeaderComponent; // Referência ao componente do header

  public emblaApi?: EmblaCarouselType;
  public options = { loop: false };
  products: any[] = [];
  selectedProducts: any[] = [];
  productsByCategory: { [category: string]: any[] } = {};
  isBeginning = true;
  isEnd = false;
  isLoading = true;  // Variável para controlar o estado de carregamento

  constructor(private productService: ProductService, private paymentService: PaymentService) {}

  ngOnInit(): void {
    // Iniciar o carregamento dos produtos
    this.loadProducts();
  }

  private loadProducts(): void {
    // Marca o início do carregamento
    this.isLoading = true;

    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.groupProductsByCategory(data);
      // Define como falso após os dados serem carregados
      setTimeout(() => {
        this.isLoading = false;
      }, 3000);
    });
  }

  ngAfterViewInit() {
    if (this.emblaRef) {
      this.emblaApi = this.emblaRef.emblaApi;

      // Atualiza a visibilidade das setas no início e nos eventos de rolagem
      this.updateArrowsVisibility();
      this.emblaApi!.on('select', () => this.updateArrowsVisibility());
    }
  }

  updateArrowsVisibility() {
    if (this.emblaApi) {
      this.isBeginning = !this.emblaApi.canScrollPrev();
      this.isEnd = !this.emblaApi.canScrollNext();
    }
  }

  private groupProductsByCategory(products: any[]): void {
    this.productsByCategory = products.reduce((acc, product) => {
      const category = product.category ? product.category.name : 'Sem Categoria';
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {});
  }

  // Adiciona ou remove produtos do carrinho
  toggleSelection(product: any) {
  const index = this.selectedProducts.findIndex(p => p.id === product.id);
  if (index === -1) {
    this.selectedProducts.push(product);
  } else {
    this.selectedProducts.splice(index, 1);
  }
}
getTotalAmount(): number {
  return this.selectedProducts.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0);
}



  // Compra o produto imediatamente usando o serviço de pagamento
  buyNow(product: any) {
    const paymentData = {
      transaction_amount: product.price,
      description: `Payment for ${product.name}`,
      payment_method_id: 'pix',
      payer: { email: 'fabio.h591@gmail.com' },
    };

    this.paymentService.createPayment(paymentData).subscribe(
      (response) => {
        const paymentUrl = response.point_of_interaction.transaction_data.ticket_url;
        window.open(paymentUrl, '_blank');
      },
      (error) => {
        console.error('Payment error:', error);
      }
    );
  }

  // Processa o pagamento de múltiplos produtos selecionados
  processPayment() {
    if (this.selectedProducts.length === 0) {
      alert('Please select at least one product!');
      return;
    }

    const totalAmount = this.selectedProducts.reduce((sum, product) => sum + product.price, 0);
    const paymentData = {
      transaction_amount: totalAmount,
      description: 'Payment for selected products',
      payment_method_id: 'pix',
      payer: { email: 'fabio@gmail.com' },
    };
  
    this.paymentService.createPayment(paymentData).subscribe(
      (response) => {
        console.log('Payment successful');
      },
      (error) => {
        console.error('Payment error:', error);
      }
    );
  }

  // Função para abrir o drawer no NftHeaderComponent
  openCartDrawer() {
    this.nftHeader.openDrawer();
  }
}
