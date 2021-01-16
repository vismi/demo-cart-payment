import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from "./dashboard/dashboard.component";
import { PaymentDetailFormComponent } from "./payment-detail-form/payment-detail-form.component"

const routes: Routes = [
  {path: '', redirectTo: '/cartSummary', pathMatch: 'full'},
  {path: 'cartSummary', component: DashboardComponent},
  {path: 'paymentDetails',component: PaymentDetailFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
