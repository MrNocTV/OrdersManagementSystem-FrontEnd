import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL, API_URL_PROD } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class OrderStatusService {

  constructor(private http:HttpClient) { }

  retrieveAllStatuses() {
    return this.http.get<Array<any>>(`${API_URL_PROD}/api/order_status`)
  }
}
