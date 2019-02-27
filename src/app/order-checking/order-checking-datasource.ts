import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { OrderItem } from '../order/order.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { OrdersService } from '../service/data/orders.service';
import { catchError, finalize } from 'rxjs/operators';

export class OrderCheckingDataSource implements DataSource<OrderItem> {
    public orderItems = new BehaviorSubject<OrderItem[]>([]);
    private loadingOrderItems = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingOrderItems.asObservable();

    constructor(private orderService:OrdersService) { }

    connect(collectionViewer: CollectionViewer): Observable<OrderItem[]> {
        return this.orderItems.asObservable()
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.orderItems.complete()
        this.loadingOrderItems.complete()
    }

    loadOrderItems(orderCode:string) {
        this.loadingOrderItems.next(true)

        this.orderService.retrieveItemsOfOrder(orderCode).pipe(
            catchError(() => of([])),
            finalize( () => this.loadingOrderItems.next(false))
        ).subscribe(data => {
            console.log(data)
            this.orderItems.next(data.orderItems)
        })
    }
}