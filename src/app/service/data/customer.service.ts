import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL, API_URL_PROD } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http:HttpClient) { }

  retrieveAllCustomers() {
    return this.http.get<Array<any>>(`${API_URL_PROD}/api/customer`)
  }
}
