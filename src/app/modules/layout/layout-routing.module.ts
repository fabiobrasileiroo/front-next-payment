import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'products',
    component: LayoutComponent,
    loadChildren: () => import('../products/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard], // Aplicar o guard aqui
  },
  {
    path: 'collaboration',
    component: LayoutComponent,
    loadChildren: () => import('../collaboration/collaboration.module').then((m) => m.CollaborationModule),
    canActivate: [AuthGuard], // Aplicar o guard aqui
  },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
