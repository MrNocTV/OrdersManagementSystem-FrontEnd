import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from 'src/app/app.constants';
import { Item } from 'src/app/list-items/item-datasource';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http:HttpClient) { }

  retrieveItems(filter='', sortOrder='asc',pageNumber=0, pageSize=3): Observable<Item[]> {
    return this.http.get<Item[]>(`${API_URL}/api/items`, {
      params: new HttpParams()
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    })
  }

  retrieveItemsCount() : Observable<number>{
    return this.http.get<number>(`${API_URL}/api/items/count`)
  }
}