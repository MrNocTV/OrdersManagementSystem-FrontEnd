import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL, API_URL_PROD } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  retrieveAllUsers(username:string) {
    return this.http.get<Array<any>>(`${API_URL_PROD}/api/users/${username}/all`)
  }
}
