import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { API_URL, API_URL_PROD } from 'src/app/app.constants';
import { Item } from 'src/app/list-items/item-datasource';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  retrieveItems(filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 3): Observable<Item[]> {
    return this.http.get<Item[]>(`${API_URL_PROD}/api/items`, {
      params: new HttpParams()
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    })
  }

  retrieveItemsCount(): Observable<number> {
    return this.http.get<number>(`${API_URL_PROD}/api/items/count`)
  }

  createItem(item: Item) {
    return this.http.post(`${API_URL_PROD}/api/items`, item)
  }

  uploadItemImage(files: File[], barcode: string) {
    let formData: FormData = new FormData()
    for(let i =0; i < files.length; i++){
      formData.append("uploads[]", files[i], files[i]['name']);
    }
    formData.append('barcode', barcode)
    console.log('form data variable :   '+ formData.toString());

    const req = new HttpRequest('POST', `${API_URL_PROD}/api/items/image`, formData, {
      reportProgress: true,
      responseType: 'text'
    })
    return this.http.request(req);
  }

  getItemImages(barcode: string) {
    return this.http.get<any>(`${API_URL_PROD}/api/items/images/${barcode}`)
  }
}
