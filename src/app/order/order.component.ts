import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OrdersService } from '../service/data/orders.service';
import { AuthenticationService } from '../service/authentication.service';
import { OrderTypeService } from '../service/data/order-type.service';
import { OrderStatusService } from '../service/data/order-status.service';
import { AnimationPlayer } from '@angular/animations';
import { CustomerService } from '../service/data/customer.service';
import { UserService } from '../service/data/user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  order: Order
  statusArr: Status[] = new Array<Status>()
  typeArr: Type[] = new Array<Type>()
  customerArr: Customer[] = new Array<Customer>()
  checkerArr: Checker[] = new Array<Checker>()
  constructor(private dialogRef: MatDialogRef<OrderComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private orderService: OrdersService, private authService: AuthenticationService,
    private orderTypeService: OrderTypeService, private orderStatusServie: OrderStatusService,
    private customerService: CustomerService, private userService: UserService) { }

  ngOnInit() {
    this.order = new Order(undefined, undefined, undefined, new Date(), undefined, undefined, undefined)
    let username = this.authService.getAuthenticatedUser()
    this.orderService.retrieveNextOrderCode(username).subscribe(
      data => {
        this.order.code = data
      },
      error => {
        console.log(error)
      }
    )
    this.orderTypeService.retrieveAllTypes().subscribe(
      data => {
        data.forEach(e => {
          this.typeArr.push(new Type(e.name, e.description))
          if (e.name === 'Shipping')
            this.order.type = e.name
        })
      }, error => {
        console.log(error)
      }
    )
    this.orderStatusServie.retrieveAllStatuses().subscribe(
      data => {
        data.forEach(e => {
          this.statusArr.push(new Status(e.id, e.name, e.description))
          if (e.name === 'On Creation')
            this.order.status = e.name
        })
      }, error => {
        console.log(error)
      }
    )
    this.customerService.retrieveAllCustomers().subscribe(
      data => {
        data.forEach(e => {
          this.customerArr.push(new Customer(e.name, e.address, e.createdDate))
          this.order.customer = e.name
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
          this.order.checker = e.name
        })
        console.log(data)
      }, error => {
        console.log(error)
      }
    )
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public createOrder() {
    let username = this.authService.getAuthenticatedUser()
    this.order.owner = username
    this.orderService.createOrder(this.order).subscribe(
      data =>{
        console.log(data)
        this.closeDialog()
      }, 
      error =>{
        console.log(error)
      }
    )
  }

}

export class Order {
  constructor(public code: string, public type: string, public status: string, public createdDate: Date, public customer: string, public owner:string, public checker:string) {
  }
}

export class Status {
  constructor(public id: number, public name: string, public description: string) { }
}

export class Type {
  constructor(public name: string, public description: string) { }
}

export class Customer {
  constructor(public name: string, public address: string, public createdDate: Date) { }
}

export class Checker {
  constructor(public name: string) {}
}

export class Item {
  constructor(public code: string) {}
}