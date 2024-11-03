import { Component, OnInit } from '@angular/core';
import { Nft } from '../../models/nft';
import { NftAuctionsTableComponent } from '../../components/nft/nft-auctions-table/nft-auctions-table.component';
import { NftChartCardComponent } from '../../components/nft/nft-chart-card/nft-chart-card.component';
import { NftSingleCardComponent } from '../../components/nft/nft-single-card/nft-single-card.component';
import { NftDualCardComponent } from '../../components/nft/nft-dual-card/nft-dual-card.component';
import { NftHeaderComponent } from '../../components/nft/nft-header/nft-header.component';
import { ProductService } from 'src/app/core/services/product.service';
import { CurrencyPipe, NgFor, NgStyle } from '@angular/common';
import { PaymentService } from 'src/app/core/services/payment-pix.service';

@Component({
  selector: 'app-nft',
  templateUrl: './nft.component.html',
  standalone: true,
  imports: [
    NgFor,
    NftHeaderComponent,
    NftDualCardComponent,
    NftSingleCardComponent,
    NftChartCardComponent,
    NftAuctionsTableComponent,
    CurrencyPipe,
    NgStyle,
  ],
})
export class NftComponent implements OnInit {

  // nft: Array<Nft>;
  // products: Array<any> = []
  products!: any
  selectedProducts: Array<any> = [];

  constructor(private productService: ProductService, private paymentService: PaymentService) {
    // this.nft = [
    //   {
    //     id: 34356771,
    //     title: 'Girls of the Cartoon Universe',
    //     creator: 'Jhon Doe',
    //     instant_price: 4.2,
    //     price: 187.47,
    //     ending_in: '06h 52m 47s',
    //     last_bid: 0.12,
    //     image: './assets/images/img-01.jpg',
    //     avatar: './assets/avatars/avt-01.jpg',
    //   },
    //   {
    //     id: 34356772,
    //     title: 'Pupaks',
    //     price: 548.79,
    //     last_bid: 0.35,
    //     image: './assets/images/img-02.jpg',
    //   },
    //   {
    //     id: 34356773,
    //     title: 'Seeing Green collection',
    //     price: 234.88,
    //     last_bid: 0.15,
    //     image: './assets/images/img-03.jpg',
    //   },
    // ];
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data
      console.log("🚀 ~ NftComponent ~ this.productService.getProducts ~ products:", data)
    })
  }

  // Toggle product selection for the cart
  toggleSelection(product: any) {
    const index = this.selectedProducts.findIndex(p => p.id === product.id);
    if (index > -1) {
      this.selectedProducts.splice(index, 1);
    } else {
      this.selectedProducts.push(product);
    }
  }

  // Buy the selected product immediately
  buyNow(product: any) {
    const paymentData = {
      transaction_amount: product.price,
      description: `Payment for ${product.name}`,
      payment_method_id: 'pix',
      payer: {
        email: 'fabio.h591@gmail.com',
      },
    };

    // Call the payment service to process payment
    this.paymentService.createPayment(paymentData).subscribe(
      (response) => {
        const paymentUrl = response.point_of_interaction.transaction_data.ticket_url
        console.log("🚀 ~ NftComponent ~ buyNow ~ response:", paymentUrl)
        console.log('Payment successful for ' + product.name + '!');
        //  / Open the URL in a new tab
        window.open(paymentUrl, '_blank');
      },
      (error) => {
        console.error('Payment error:', error);
      }
    );
  }

  // Process payment for multiple selected products
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
      payer: {
        email: 'fabio@gmail.com',
      }
    };

    // Call the payment service to create a payment
    this.paymentService.createPayment(paymentData).subscribe(
      (response) => {
        console.log("🚀 ~ NftComponent ~ processPayment ~ response:", response)
        console.log('payment successful')
        // alert('Payment successful!');
      },
      (error) => {
        console.error('Payment error:', error);
      }
    );
  }
}
