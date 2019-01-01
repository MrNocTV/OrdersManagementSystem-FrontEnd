import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<OrderComponent>, @Inject(MAT_DIALOG_DATA) public data : any) { }

  ngOnInit() {
  }
  
  public closeDialog(){
    this.dialogRef.close();
  }
}