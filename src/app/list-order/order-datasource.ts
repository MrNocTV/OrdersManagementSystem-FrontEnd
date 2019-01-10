import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Order } from '../order/order.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { OrdersService } from '../service/data/orders.service';
import { AuthenticationService } from '../service/authentication.service';
import { catchError, finalize } from 'rxjs/operators';

export class OrderDataSource implements DataSource<Order> {

    private ordersSubject = new BehaviorSubject<Order[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    constructor(private orderService: OrdersService, private authService: AuthenticationService) { }

    connect(collectionViewer: CollectionViewer): Observable<Order[]> {
        return this.ordersSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.ordersSubject.complete();
        this.loadingSubject.complete();
    }

    loadOrders(filter = '',
        sortDirection = 'desc', pageIndex = 0, pageSize = 3) {
        this.loadingSubject.next(true);
        let username = this.authService.getAuthenticatedUser()
        this.orderService.retrieveAllOrders(username, filter, sortDirection,
            pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(orders => {
                console.log(orders)
                this.ordersSubject.next(orders)
            });
    }
}