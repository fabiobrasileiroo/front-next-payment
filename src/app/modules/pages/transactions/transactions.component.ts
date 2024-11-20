import { ChangeDetectorRef, Component, OnInit, ViewChild, LOCALE_ID } from '@angular/core';
import localeBr from '@angular/common/locales/pt'
import { TransactionsHeaderComponent } from "../../transactions/transactions-header/transactions-header.component";
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    HttpClientModule, 
    TransactionsHeaderComponent,
    TableModule,
    TagModule,
    ButtonModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})

export class TransactionsComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  transactions: any[] = [];
  loading: boolean = true;
  globalFilter: string = ''; // Added global filter

  constructor(private transactionService: TransactionsService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions() {
    this.transactionService.getAllPayments().subscribe(
      (response: any) => {
        this.transactions = response; // Assign API response to transactions array
        console.log("🚀 ~ TransactionsComponent ~ fetchTransactions ~ transactions:", this.transactions);
        this.cdr.detectChanges();
        this.loading = false; // Stop loading spinner
      },
      (error: Error) => {
        console.error('Error fetching transactions:', error);
        this.loading = false;
      }
    );
  }

  getSeverity(status: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'info';
      case 'cancelled':
        return 'danger';
      case 'in_review':
        return 'warn';
      default:
        return 'secondary';
    }
  }
   applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
}
