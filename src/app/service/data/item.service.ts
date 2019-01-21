import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { API_URL, API_URL_PROD } from 'src/app/app.constants';
import { Item } from 'src/app/list-items/item-datasource';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http:HttpClient) { }

  retrieveItems(filter='', sortOrder='asc',pageNumber=0, pageSize=3): Observable<Item[]> {
    return this.http.get<Item[]>(`${API_URL_PROD}/api/items`, {
      params: new HttpParams()
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    })
  }

  retrieveItemsCount() : Observable<number>{
    return this.http.get<number>(`${API_URL_PROD}/api/items/count`)
  }

  createItem(item:Item) {
    return this.http.post(`${API_URL_PROD}/api/items`, item)
  }

  uploadItemImage(file: File, barcode: string) {
    let formdata: FormData = new FormData()
    formdata.append('file', file)
    formdata.append('barcode', barcode)
    const req = new HttpRequest('POST', `${API_URL_PROD}/api/items/image`, formdata, {
      reportProgress: true,
      responseType: 'text'
    })
    return this.http.request(req);
  }
}
