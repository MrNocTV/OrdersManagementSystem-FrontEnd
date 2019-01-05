import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Type } from 'src/app/order/order.component';
import { API_URL } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class OrderTypeService {

  constructor(private http:HttpClient) { }

  retrieveAllTypes() {
    return this.http.get<Array<any>>(`${API_URL}/api/order_type`)
  }
}
