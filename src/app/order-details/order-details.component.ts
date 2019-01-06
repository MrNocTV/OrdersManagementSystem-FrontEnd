import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { Order, Status, Type, Customer, Checker } from '../order/order.component';
import { OrdersService } from '../service/data/orders.service';
import { AuthenticationService } from '../service/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { OrderTypeService } from '../service/data/order-type.service';
import { OrderStatusService } from '../service/data/order-status.service';
import { CustomerService } from '../service/data/customer.service';
import { UserService } from '../service/data/user.service';
import { ItemComponent } from '../item/item.component';
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'customColumn1'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  order: Order
  statusArr: Status[] = new Array<Status>()
  typeArr: Type[] = new Array<Type>()
  customerArr: Customer[] = new Array<Customer>()
  checkerArr: Checker[] = new Array<Checker>()

  constructor(private orderService: OrdersService, private authService: AuthenticationService, private route: ActivatedRoute,
    private orderTypeService: OrderTypeService, private orderStatusServie: OrderStatusService,
    private customerService: CustomerService, private userService: UserService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.order = new Order(undefined, undefined, undefined, undefined, undefined, undefined, undefined)
    let username = this.authService.getAuthenticatedUser()
    let orderCode = this.route.snapshot.params['orderCode']
    this.loadData(username)

    this.orderService.retrieveOrder(username, orderCode).subscribe(
      e => {
        console.log(e)
        this.order = new Order(e.orderCode, e.type.name, e.status.name, e.date, e.customer.name, e.owner.username, e.checker.username)
        this.order.createdDate = e.date.toString().split('T')[0]
      },
      error => {
        console.log(error)
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
    let dialogRef = this.dialog.open(ItemComponent, dialogConfig);
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}