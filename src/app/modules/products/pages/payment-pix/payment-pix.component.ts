import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, interval, pipe } from 'rxjs';
import { SafePipe } from 'src/app/core/pipes/pipe-safe.pipe';
import { PaymentService } from 'src/app/core/services/payment-pix.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-payment-pix',
  standalone: true,
  imports: [NgIf, SafePipe, ProgressBarModule, ToastModule, NgClass,DecimalPipe],
  templateUrl: './payment-pix.component.html',
  styleUrls: ['./payment-pix.component.scss'],
  providers: [MessageService], // Adicionar o serviço de mensagens
})
export class PaymentPixComponent implements OnInit, OnDestroy {
  navigateBack() {
    this.router.navigate(['/products/view']); // Substitua pela rota desejada
  }

  paymentUrl: string | null = null;
  paymentIframeUrl: string | null = null;
  paymentId: string | null = null;
  paymentStatus: string = 'Aguardando pagamento';
  statusMessage: string = '';
  elapsedTime: number = 0; // Tempo total decorrido em segundos
  maxTime: number = 300; // Tempo máximo de 5 minutos (300 segundos)
  progressBarValue: number = 0;
  timerInterval: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.paymentUrl = params.get('paymentUrl');
      this.paymentIframeUrl = this.paymentUrl;

      if (this.paymentUrl) {
        const regex = /\/payments\/(.*?)\/ticket/;
        const match = this.paymentUrl.match(regex);
        if (match && match[1]) {
          this.paymentId = match[1];
        } else {
          console.error('Failed to extract Payment ID from URL.');
        }
      } else {
        console.error('Payment URL not provided.');
      }

      if (this.paymentId) {
        this.startTimer();
      } else {
        console.error('Payment ID not provided in the route.');
      }
    });
  }

  startTimer(): void {
    this.timerInterval = interval(1000).subscribe(() => {
      this.elapsedTime++;
      console.log(this.paymentStatus)

      if (this.elapsedTime % 1 === 0) {
        this.checkPaymentStatus(); // Verifica o status a cada 1 segundo
      }

      if (this.paymentStatus === 'pending') {
        this.progressBarValue = 50; // Define a barra em 50% para status pendente
      } else if (this.paymentStatus === 'approved') {
        this.progressBarValue = 100; // Define a barra em 100% para status aprovado
      }

      if (this.elapsedTime >= this.maxTime) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Tempo esgotado',
          detail: 'O pagamento não foi realizado dentro do prazo de 5 minutos.',
        });

        this.stopTimer();
        setTimeout(() => {
          this.router.navigate(['/products/view']); // Substitua pela rota desejada
        }, 3000);
      }
    });
  }

  checkPaymentStatus(): void {
    if (!this.paymentId) {
      console.error('Payment ID is null. Cannot check payment status.');
      return;
    }

    this.paymentService.checkPaymentStatus(this.paymentId).subscribe(
      (response: any) => {
        this.paymentStatus = response.status;

        if (this.paymentStatus === 'approved') {
          this.statusMessage = 'Pagamento confirmado! Obrigado!';
          this.messageService.add({
            severity: 'success',
            summary: 'Pagamento realizado',
            detail: 'Seu pagamento foi confirmado com sucesso!',
          });

          this.stopTimer();
          setTimeout(() => {
            this.router.navigate(['/products/view']); // Substitua pela rota desejada
          }, 5000);
        } else if (this.paymentStatus === 'pending') {
          this.statusMessage = 'Aguardando confirmação do pagamento...';
        } else {
          this.statusMessage = 'Pagamento não realizado.';
        }
      },
      (error: Error) => {
        console.error('Erro ao verificar status do pagamento:', error);
        this.statusMessage = 'Erro ao verificar pagamento. Tente novamente.';
      }
    );
  }

  stopTimer(): void {
    if (this.timerInterval) {
      this.timerInterval.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}
