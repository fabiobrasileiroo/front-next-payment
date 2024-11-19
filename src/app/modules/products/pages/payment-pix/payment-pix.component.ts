import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { SafePipe } from 'src/app/core/pipes/pipe-safe.pipe';
import { PaymentService } from 'src/app/core/services/payment-pix.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-payment-pix',
  standalone: true,
  imports: [NgIf, SafePipe, ProgressBarModule, ToastModule, NgClass],
  templateUrl: './payment-pix.component.html',
  styleUrls: ['./payment-pix.component.scss'],
  providers: [MessageService], // Adicionar o serviço de mensagens
})
export class PaymentPixComponent implements OnInit, OnDestroy {
  navigateBack() {
    this.router.navigate(['/products/view']); // Substitua pela rota desejada
  }
  // Variáveis para URL e status do pagamento
  paymentUrl: string | null = null; // URL original
  paymentIframeUrl: string | null = null; // URL manipulada para o refresh
  paymentId: string | null = null;
  paymentStatus: string = 'Aguardando pagamento';
  statusMessage: string = '';
  timeLeft: number = 15; // Tempo total em segundos
  progressBarValue: number = 0; // Valor inicial da barra de progresso
  elapsedTime: number = 0; // Tempo decorrido
  attemptCount: number = 0; // Contador de tentativas
  maxAttempts: number = 7; // Número máximo de tentativas
  timerInterval: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Captura a URL do pagamento a partir da rota
    this.route.paramMap.subscribe((params) => {
      this.paymentUrl = params.get('paymentUrl');
      this.paymentIframeUrl = this.paymentUrl; // Define a URL inicial do iframe
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
    this.elapsedTime = 0;

    // Intervalo para atualizar o timer e a barra de progresso
    this.timerInterval = interval(1000).subscribe(() => {
      this.elapsedTime++;
      this.progressBarValue = Number(((this.elapsedTime / this.timeLeft) * 100).toFixed(0));

      if (this.elapsedTime >= this.timeLeft) {
        this.checkPaymentStatus(); // Verifica o status do pagamento após 15 segundos
        this.resetTimer();
      }
    });
  }

  resetTimer(): void {
    this.elapsedTime = 0;
    this.progressBarValue = 0;
    this.attemptCount++;

    if (this.attemptCount >= this.maxAttempts) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Tentativas excedidas',
        detail: 'O pagamento não foi realizado dentro do prazo.',
      });

      this.stopTimer();
      setTimeout(() => {
        this.router.navigate(['/products/view']); // Substitua pela rota desejada
      }, 3000);
    }
  }

  refreshIframe(): void {
    // Recarrega o iframe alterando sua URL
    if (this.paymentUrl) {
      this.paymentIframeUrl = `${this.paymentUrl}?timestamp=${new Date().getTime()}`;
      console.log('Iframe atualizado:', this.paymentIframeUrl); // Para depuração
    }
  }

  checkPaymentStatus(): void {
    if (!this.paymentId) {
      console.error('Payment ID is null. Cannot check payment status.');
      return;
    }

    // Verifica o status do pagamento com a API
    this.paymentService.checkPaymentStatus(this.paymentId).subscribe(
      (response: any) => {
        this.paymentStatus = response.status;

        // Se o pagamento for aprovado, exibe uma mensagem de sucesso
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
          // Se o pagamento estiver pendente, apenas mostra a mensagem
          this.statusMessage = 'Aguardando confirmação do pagamento...';
        } else if (this.paymentStatus === 'refresh_required') {
          // Se for necessário um refresh, recarrega o iframe
          this.statusMessage = 'Atualizando status de pagamento...';
          this.refreshIframe();
        } else {
          // Para outros status de falha ou erro
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
      this.timerInterval.unsubscribe(); // Para o intervalo de contagem
    }
  }

  ngOnDestroy(): void {
    this.stopTimer(); // Limpa o intervalo quando o componente é destruído
  }
}
