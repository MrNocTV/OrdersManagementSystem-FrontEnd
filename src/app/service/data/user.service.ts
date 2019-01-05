import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  retrieveAllUsers(username:string) {
    return this.http.get<Array<any>>(`${API_URL}/api/users/${username}/all`)
  }
}
