import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule } from '@angular/material';
import { OrderComponent, Order } from '../order/order.component';
import { OrdersService } from '../service/data/orders.service';
import Quagga from 'quagga'
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css']
})
export class ListOrderComponent implements OnInit {
  orders: Order[] = []
  config: any
  page: number = 1
  totalPages: number = 1
  show = false

  constructor(private http: HttpClient, public dialog: MatDialog, private orderService: OrdersService, private authService:AuthenticationService,
    private router:Router) {
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    let dialogRef = this.dialog.open(OrderComponent, dialogConfig);
    dialogRef.afterClosed()
      .subscribe(() => {
        let username = this.authService.getAuthenticatedUser()
        this.orderService.countOrder(username).subscribe(
          data => {
            if (data != this.config['totalItems']) {
              let maxPage = Math.ceil(data / 10)
              if (maxPage != this.page)
                this.page = maxPage
              this.config = {
              currentPage: this.page,
              itemsPerPage: 10,
              totalItems: data
              }
              this.show = true
              this.loadOrders()
            }
          }, error => {
            console.log(error)
          }
        )
        
       })
  }

  loadOrders() {
    let username = this.authService.getAuthenticatedUser()
    this.orders = []
    this.orderService.retrieveAllOrders(username, this.page - 1).subscribe(
      data => {
        data.forEach(e => {
          if (e.checker != null) {
            let order = new Order(e.orderCode, e.type.name, e.status.name, e.date, e.customer.name, e.owner.name, e.checker.name);
            this.orders.push(order);
          } else {
            let order = new Order(e.orderCode, e.type.name, e.status.name, e.date, e.customer.name, e.owner.name, undefined);
            this.orders.push(order);
          }
        });
      },
      error => {
        console.log(error)
      }
    )
  }

  ngOnInit() {
    let username = this.authService.getAuthenticatedUser()
    this.loadOrders()
    this.orderService.countOrder(username).subscribe(
      data => {
        this.config = {
          currentPage: this.page,
          itemsPerPage: 10,
          totalItems: data
        }
        this.show = true
      }, error => {
        console.log(error)
      }
    )
  }

  pageChange(event) {
    this.config['currentPage'] = event
    this.page = event
    this.loadOrders()    
  }

  tableRowClick(orderCode:string) {
    console.log('click ' + orderCode)
    this.router.navigate([`orders/order`, orderCode])
  }
}
