import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { DashboardComponent } from './dashboard.component';
// import { NftComponent } from './pages/nft/nft.component';
// import { PodcastComponent } from './pages/podcast/podcast.component';
// import { AddProductComponent } from './pages/add-product/add-product.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
// import { PaymentPixComponent } from './pages/payment-pix/payment-pix.component';
import { TransactionsComponent } from '../pages/transactions/transactions.component';
import { CollaborationComponent } from './collaboration.component';
import { UsersComponent } from './pages/users/users.component';
import { CompanyUnitComponent } from './company-unit/company-unit.component';

const routes: Routes = [
  {
    path: '',
    component: CollaborationComponent,
    children: [
      { path: '', redirectTo: 'view', pathMatch: 'full'},
      { path: 'users', component: UsersComponent },
      { path: 'company-unit', component: CompanyUnitComponent },
      // { path: 'add', component: AddProductComponent },
      // { path: 'transactions', component: TransactionsComponent },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollaborationRoutingModule {}
