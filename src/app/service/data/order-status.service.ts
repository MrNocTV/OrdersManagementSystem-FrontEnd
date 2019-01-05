import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class OrderStatusService {

  constructor(private http:HttpClient) { }

  retrieveAllStatuses() {
    return this.http.get<Array<any>>(`${API_URL}/api/order_status`)
  }
}
