import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ErrorComponent } from './error/error.component';
import { ListOrderComponent } from './list-order/list-order.component';
import { RouteGuardService } from './service/route-guard.service';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { ListItemsComponent } from './list-items/list-items.component';
import { OrderCheckingComponent } from './order-checking/order-checking.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [RouteGuardService] },
  { path: 'orders', component: ListOrderComponent, canActivate: [RouteGuardService] },
  { path: 'orders/order/:orderCode', component: OrderDetailsComponent, canActivate: [RouteGuardService] },
  { path: 'items', component: ListItemsComponent, canActivate: [RouteGuardService] },
  { path: 'checking-order', component: OrderCheckingComponent, canActivate: [RouteGuardService] },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
