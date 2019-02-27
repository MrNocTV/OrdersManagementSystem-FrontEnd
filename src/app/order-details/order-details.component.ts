import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Order, Status, Type, Customer, Checker, Item, OrderItem } from '../order/order.component';
import { OrdersService } from '../service/data/orders.service';
import { AuthenticationService } from '../service/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderTypeService } from '../service/data/order-type.service';
import { OrderStatusService } from '../service/data/order-status.service';
import { CustomerService } from '../service/data/customer.service';
import { UserService } from '../service/data/user.service';
import { ItemComponent } from '../item/item.component';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  order: Order
  statusArr: Status[] = new Array<Status>()
  typeArr: Type[] = new Array<Type>()
  customerArr: Customer[] = new Array<Customer>()
  checkerArr: Checker[] = new Array<Checker>()
  items: OrderItem[] = []
  loading: boolean = true
  total: number = 0

  constructor(private orderService: OrdersService, private authService: AuthenticationService, private route: ActivatedRoute,
    private orderTypeService: OrderTypeService, private orderStatusServie: OrderStatusService,
    private customerService: CustomerService, private userService: UserService,
    private dialogRef: MatDialogRef<OrderDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, private router:Router) { }

  ngOnInit() {
    this.order = new Order(undefined, undefined, undefined, undefined, undefined, undefined, undefined)
    let username = this.authService.getAuthenticatedUser()
    console.log('data', this.data.order)
    let orderCode = this.data.order.orderCode
    this.loadData(username)

    this.orderService.retrieveOrder(username, orderCode).subscribe(
      e => {
        console.log(e)
        this.order = new Order(e.orderCode, e.type.name, e.status.name, e.date, e.customer.name, e.owner.username, e.checker.username)
        this.order.createdDate = e.date.toString().split('T')[0]

        this.loadItem(orderCode)
      },
      error => {
        console.log(error)
        this.loading = false
      }
    )
  }

  loadItem(orderCode:string) {
    this.total = 0
    this.items = new Array<OrderItem>()
    this.orderService.retrieveItemsOfOrder(orderCode).subscribe(
      data => {
        console.log("RETRIEVE", data.orderItems)
        this.items = data.orderItems
        for (var i = 0; i < this.items.length; ++i) {
          this.total += this.items[i].price * this.items[i].quantity
        }
        this.loading = false
      }, error => {
        console.log("ERROR")
        this.loading = false
      }
    )
  }

  loadData(username: string) {
    this.orderTypeService.retrieveAllTypes().subscribe(
      data => {
        data.forEach(e => {
          this.typeArr.push(new Type(e.name, e.description))
        })
      }, error => {
        console.log(error)
      }
    )
    this.orderStatusServie.retrieveAllStatuses().subscribe(
      data => {
        data.forEach(e => {
          this.statusArr.push(new Status(e.id, e.name, e.description))
        })
      }, error => {
        console.log(error)
      }
    )
    this.customerService.retrieveAllCustomers().subscribe(
      data => {
        data.forEach(e => {
          this.customerArr.push(new Customer(e.name, e.address, e.createdDate))
        })
      },
      error => {
        console.log(error)
      }
    )
    this.userService.retrieveAllUsers(username).subscribe(
      data => {
        data.forEach(e => {
          this.checkerArr.push(new Checker(e.name))
        })
      }, error => {
        console.log(error)
      }
    )
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
  }

  itemAddClick() {
    if (this.order.status !== 'On Creation') {
      swal({
        title: 'ERROR',
        text: `Cannot add item, order is being checked`,
        icon: 'error'
      });
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '400px';
      dialogConfig.data = {
        'from' : 'OrderDetails',
        'orderCode' : this.order.code
      }
      let dialogRef: MatDialogRef<ItemComponent, any>
      dialogRef = this.dialog.open(ItemComponent, dialogConfig);
    
      dialogRef.afterClosed().subscribe(
        result => {
          this.loadItem(this.order.code)
        }
      )
    }
  }

  itemRemoveClick(barcode: string) {
    console.log("REMOVE " + barcode)
    console.log('this ', this.items)
    this.loading = true
    let index = -1
    for (var i = 0; i < this.items.length; ++i) {
      if (this.items[i].barcode === barcode) {
        index = i
        break
      }
    }

    let orderCode = this.items[index].orderCode
    this.orderService.removeItem(orderCode, barcode).subscribe(
      data => {
        if (index !== -1) {
          this.total -= this.items[index].price * this.items[index].quantity
          this.items.splice(index, 1);
          swal({
            title: 'SUCCESS',
            text: `Item ${barcode} removed from the order!`,
            icon: 'success'
          });
          this.loading = false
        }
      },
      error => {
        swal({
          title: 'ERROR',
          text: `Remove item failed`,
          icon: 'error'
        });
        this.loading = false
      }
    )
  }

  updateOrderInfo() {
    this.loading = true
    this.orderService.updateOrder(this.order).subscribe(
      data => {
        swal({
          title: 'SUCCESS',
          text: ' Order info has been updated',
          icon: 'success'
        });
        this.loading = false
      },
      error => {
        console.log("ERROR", error)
        this.loading = false
      }
    )
  }

  toCheckingPage() {
    this.dialogRef.close()
    this.router.navigate(['/checking-order'], {queryParams: {orderCode: this.order.code}})
  }
}

