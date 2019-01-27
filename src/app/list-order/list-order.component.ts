import { Component, OnInit, ViewChild, ElementRef, Inject, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule, MatPaginator, MatDialogRef } from '@angular/material';
import { OrderComponent, Order } from '../order/order.component';
import { OrdersService } from '../service/data/orders.service';
import Quagga from 'quagga'
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';
import { OrderDataSource } from './order-datasource';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { OrderDetailsComponent } from '../order-details/order-details.component';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css']
})
export class ListOrderComponent implements OnInit, AfterViewInit {
  displayedColumns = ["id", "code", "createdDate", "customer", "type", "status", "customColumn1"];
  dataSource: OrderDataSource
  length: number

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;

  constructor(private http: HttpClient, public dialog: MatDialog, private orderService: OrdersService, private authService: AuthenticationService,
    private router: Router) {
  }

  ngOnInit() {
    this.dataSource = new OrderDataSource(this.orderService, this.authService);
    this.dataSource.loadOrders();
    this.getOrderCount()
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadOrderPage();
        })
      )
      .subscribe();

    this.paginator.page
      .pipe(
        tap(() => this.loadOrderPage())
      )
      .subscribe();
  }

  loadOrderPage() {
    this.dataSource.loadOrders(
      this.input.nativeElement.value,
      'asc',
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  getOrderCount() {
    this.orderService.countOrder(this.authService.getAuthenticatedUser()).subscribe(
      count => {
        this.length = count
      }
    )
  }

  onRowClicked(order:Order) {
    
    console.log('CLLSLSLSLS')
    console.log(order)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      order
    }
    let dialogRef: MatDialogRef<OrderDetailsComponent, any>
    dialogRef = this.dialog.open(OrderDetailsComponent, dialogConfig)
    dialogRef.afterClosed().subscribe(
      result => {
        this.getOrderCount()
        this.loadOrderPage()
      }
    )
  }

  openDialog(order:Order) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    let dialogRef: MatDialogRef<OrderComponent, any>
    if (typeof order === 'undefined') {
      dialogRef = this.dialog.open(OrderComponent, dialogConfig);
    } else {
      dialogConfig.data = {
        order
      }
      dialogRef = this.dialog.open(OrderComponent, dialogConfig)
    }
    dialogRef.afterClosed().subscribe(
      result => {
        this.getOrderCount()
        this.loadOrderPage()
      }
    )
  }
}
