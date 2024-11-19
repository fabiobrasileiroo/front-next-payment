import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { NftComponent } from './pages/nft/nft.component';
import { PodcastComponent } from './pages/podcast/podcast.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { PaymentPixComponent } from './pages/payment-pix/payment-pix.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'view', pathMatch: 'full'},
      { path: 'view', component: NftComponent },
      { path: 'payment-pix', component: PaymentPixComponent },
      { path: 'add', component: AddProductComponent },
      { path: 'podcast', component: PodcastComponent },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
