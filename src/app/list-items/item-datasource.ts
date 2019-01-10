import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ItemService } from '../service/data/item.service';
import { catchError, finalize } from 'rxjs/operators';
export class Item {
    constructor(public barcode: string, public description: string, public priceIn:number, public priceOut:number, public inStock:number) { }
}

export class ItemsDataSource implements DataSource<Item> {

    private itemsSubject = new BehaviorSubject<Item[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    constructor(private itemService: ItemService) { }

    connect(collectionViewer: CollectionViewer): Observable<Item[]> {
        return this.itemsSubject.asObservable()
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.itemsSubject.complete()
        this.loadingSubject.complete()
    }

    loadItems(filter = '', sortDirection = '', pageIndex = 0, pageSize = 3) {
        this.loadingSubject.next(true)

        this.itemService.retrieveItems(filter, sortDirection, pageIndex, pageSize).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(items => this.itemsSubject.next(items))
    }
}