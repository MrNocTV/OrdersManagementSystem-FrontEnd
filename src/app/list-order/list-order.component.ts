import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../app.constants';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { OrderComponent } from '../order/order.component';
import { Subject } from 'rxjs';
declare var $;

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css']
})
export class ListOrderComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  orders : Order[] = [];

  constructor(private http: HttpClient, public dialog: MatDialog) {

  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    this.dialog.open(OrderComponent, dialogConfig);
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 2,
      responsive: true
    };

  }
}

export class Order {
  code:string
  type:string
  status:string
  createdDate:Date
  total:number
  customer:string
}

