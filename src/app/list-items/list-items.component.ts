import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ItemsDataSource } from './item-datasource';
import { ItemService } from '../service/data/item.service';
import { MatPaginator } from '@angular/material';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css']
})
export class ListItemsComponent implements OnInit, AfterViewInit {
  displayedColumns = ["id", "barcode", "description", "inPrice", "outPrice", "inStock"]
  dataSource: ItemsDataSource
  length:number
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.dataSource = new ItemsDataSource(this.itemService);
    this.dataSource.loadItems()
    this.getItemsCount()
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

  ngAfterViewInit() {
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
      '',
      'asc',
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
}
