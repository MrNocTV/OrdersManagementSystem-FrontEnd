import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from 'src/app/app.constants';
import { Order } from 'src/app/order/order.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  retrieveAllOrders(username: string, filter = '', sortOrder = '',
    pageNumber = 0, pageSize = 3): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_URL}/api/orders/users/${username}`, {
        params: new HttpParams()
          .set('filter', filter)
          .set('sortOrder', sortOrder)
          .set('pageNumber', pageNumber.toString())
          .set('pageSize', pageSize.toString())
    })
  }

  retrieveNextOrderCode(username: string) {
    return this.http.get<string>(`${API_URL}/api/orders/users/${username}/next_code`)
  }

  createOrder(order: Order) {
    return this.http.post(`${API_URL}/api/orders`, order)
  }

  retrieveOrder(username: string, orderCode: string) {
    return this.http.get<any>(`${API_URL}/api/orders/users/${username}/${orderCode}`)
  }

  countOrder(username: string) {
    return this.http.get<number>(`${API_URL}/api/orders/users/${username}/count`)
  }
}
