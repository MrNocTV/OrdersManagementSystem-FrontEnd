import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { OrdersService } from '../service/data/orders.service';
import { OrderCheckingDataSource } from './order-checking-datasource';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { OrderItem, Order } from '../order/order.component';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-order-checking',
  templateUrl: './order-checking.component.html',
  styleUrls: ['./order-checking.component.css']
})
export class OrderCheckingComponent implements OnInit {
  displayedColumns = ["id", "barcode", "description", "unit", "quantity", "price", "total"]
  dataSource: OrderItem[] = []
  orderCode: string
  item: OrderItem
  barcodePicker: any = null
  numberOfItems: number
  numberOfCheckedItems: number = 0
  loading: boolean = false
  @ViewChild(MatPaginator) paginator: MatPaginator

  constructor(private orderService: OrdersService, private route: ActivatedRoute, private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.item = new OrderItem(undefined, undefined, undefined, undefined, undefined, undefined, false)
    this.route.queryParams.subscribe(params => {
      this.orderCode = params['orderCode']
    }
    )
    console.log("Ordercode " + this.orderCode)
    this.loading = true
    this.orderService.retrieveItemsOfOrder(this.orderCode).subscribe(
      data => {
        for (var i = 0; i < data.orderItems.length; ++i) {
          var item = data.orderItems[i]
          this.dataSource.push(new OrderItem(item.barcode, this.orderCode, item.quantity, item.price, item.unit, item.description, item.checked))
          if (item.checked === true) {
            this.numberOfCheckedItems += 1
          }
        }
        this.numberOfItems = data.orderItems.length
        this.loading = false
      }, error => {
        this.loading = false
      }
    )
  }

  changeOrderStatusToComplete() {
    let userName = this.authService.getAuthenticatedUser()
    let order = this.orderService.retrieveOrder(userName, this.orderCode).subscribe(
      data => {
        console.log('order: ' + data.orderCode)
        for (var prop in data) {
          console.log(prop)
        }
        let order: Order = new Order(data.orderCode, data.type.name, data.status.name, data.date, data.customer.name, data.owner.username, data.checker.username)
        // update status
        order.status = "Complete checking"
        this.orderService.updateOrder(order).subscribe(
          data => {
            // redirect to orders page
            this.router.navigate(['/orders'])
          }, error => {
            swal({
              title: 'CANNOT CHECK ORDER STATUS',
              text: 'Order status cannot be changed to "Completed checking".',
              icon: 'error'
            })
          }
        )
      }, error => {
        swal({
          title: 'CANNOT CHECK ORDER STATUS',
          text: 'Order status cannot be changed to "Completed checking".',
          icon: 'error'
        })
      }
    )
  }


  detectBarcode(barcode: string) {
    console.log("barcode " + barcode)
    this.loading = true
    for (var i = 0; i < this.dataSource.length; ++i) {
      var item = this.dataSource[i]
      if (item.barcode === barcode) {
        if (item.checked === true) {
          swal({
            title: 'ITEM ALREADY CHECKED',
            text: 'This item has been checked',
            icon: 'error'
          })
          this.loading = false
        } else {
          item.checked = true
          this.orderService.checkItem(this.orderCode, item.barcode).subscribe(
            data => {
              console.log("Data " + data)
              this.numberOfCheckedItems += 1
              // if we check all item, autotatically set this order status to "Complete checking"
              // and redirecte user to order page
              if (this.numberOfCheckedItems == this.numberOfItems) {
                swal({
                  title: 'FINISH CHECKING',
                  text: 'Thank you for your effort. All items have been checked successfully.\n' +
                    'Order status will now be changed to "Complete checking"',
                  icon: 'success'
                }).then(
                  function () {
                    this.changeOrderStatusToComplete()
                  }.bind(this)
                )
              }
            }, error => {
              swal({
                title: 'CHECK FAILED',
                text: 'Failed to check this item, please try reloading the page and try again',
                icon: 'error'
              })
            }
          )
          this.loading = false
        }
      }
    }
    this.loading = false
  }

  loadNumberOfItems() {

  }

  loadNumberOfCheckedItems() {

  }


}
