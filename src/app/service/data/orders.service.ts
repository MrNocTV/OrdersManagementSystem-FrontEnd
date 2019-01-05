import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/app.constants';
import { Order } from 'src/app/order/order.component';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  retrieveAllOrders(username: string, page: number) {
    return this.http.get<Array<any>>(`${API_URL}/api/orders/users/${username}/${page}`)
  }

  retrieveNextOrderCode(username: string) {
    return this.http.get<string>(`${API_URL}/api/orders/users/${username}/next_code`)
  }

  createOrder(order: Order) {
    return this.http.post(`${API_URL}/api/orders`, order)
  }

  countOrder(username: string) {
    return this.http.get<number>(`${API_URL}/api/orders/users/${username}/count`)
  }
}
