import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ItemsDataSource } from './item-datasource';
import { ItemService } from '../service/data/item.service';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css']
})
export class ListItemsComponent implements OnInit, AfterViewInit {
  displayedColumns = ["id", "barcode", "description", "inPrice", "outPrice", "inStock", "customColumn1"]
  dataSource: ItemsDataSource
  length: number
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;
  constructor(private itemService: ItemService, public dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource = new ItemsDataSource(this.itemService);
    this.dataSource.loadItems()
    this.getItemsCount()
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadItemsPage();
        })
      )
      .subscribe();

    // reset the paginator after sorting

    this.paginator.page
      .pipe(
        tap(() => {
          console.log('tab')
          this.loadItemsPage()
        })
      )
      .subscribe();
  }

  loadItemsPage() {
    this.dataSource.loadItems(
      this.input.nativeElement.value,
      '',
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  getItemsCount() {
    this.itemService.retrieveItemsCount().subscribe(
      data => {
        this.length = data
      },
      error => console.log(error)
    )
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    let dialogRef = this.dialog.open(ItemComponent, dialogConfig);
  }
}
