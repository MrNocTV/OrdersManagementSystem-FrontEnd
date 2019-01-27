import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Quagga from 'quagga';
import { Barcode, BarcodePicker, ScanSettings, configure } from "scandit-sdk";
import { API_KEY, API_KEY_PROD, API_URL_PROD } from '../app.constants';
import { isNumber } from 'util';
import swal from 'sweetalert';
import { ItemService } from '../service/data/item.service';
import { Item } from '../list-items/item-datasource';
import { HttpEventType } from '@angular/common/http';
import { OrdersService } from '../service/data/orders.service';
import { OrderItem } from '../order/order.component';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  filesToUpload: File[]
  progress: { percentage: number } = { percentage: 0 }
  item: Item
  show: boolean = true
  loadingItem: boolean = false
  parentData: Item
  itemImageURLs: string[]
  title: string
  barcodePicker: any = null
  fromOrderDetails: boolean = false
  orderCode: string = null
  quantity: number = 0

  constructor(private dialogRef: MatDialogRef<ItemComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private itemService: ItemService, private orderService: OrdersService) {
    console.log('data from parent', data)
    if (this.data !== null) {
      this.parentData = data.item
      this.show = false
      if (data.from === 'OrderDetails') {
        this.show = true
        this.fromOrderDetails = true
        this.orderCode = data.orderCode
      }
      this.title = 'Item Details'
    } else {
      this.title = 'Create Item'
    }
  }

  ngOnInit() {
    this.item = new Item(undefined, undefined, undefined, undefined, undefined, undefined)
    if (this.parentData !== null && typeof this.parentData !== 'undefined') {
      console.log('data from parent 1', this.parentData)
      this.show = false
      this.loadingItem = true
      this.item = new Item(this.parentData.barcode, this.parentData.description, this.parentData.priceIn, this.parentData.priceOut, this.parentData.inStock, this.parentData.unit)
      this.itemService.getItemImages(this.parentData.barcode).subscribe(
        data => {
          let fileNames = data.fileNames
          console.log(fileNames)
          this.itemImageURLs = new Array<string>()
          for (var i = 0; i < fileNames.length; ++i) {
            let itemImageURL = `${API_URL_PROD}/api/items/image/get/${fileNames[i]}`
            this.itemImageURLs.push(`${API_URL_PROD}/api/items/image/get/${fileNames[i]}`)
          }
          console.log("urls ", this.itemImageURLs)
          this.loadingItem = false
        }, error => {
          console.log('error ', error)
          this.loadingItem = false
        }
      )

    }
    configure(API_KEY, {
      engineLocation: "../../../assets/build"
    });

    if (this.show) {
      BarcodePicker.create(document.getElementById("scandit-barcode-picker"), {
        playSoundOnScan: true,
        vibrateOnScan: true
      }).then((barcodePicker) => {
        // barcodePicker is ready here to be used (rest of the tutorial code should go here)
        const scanSettings = new ScanSettings({
          enabledSymbologies: [
            Barcode.Symbology.EAN8,
            Barcode.Symbology.EAN13,
            Barcode.Symbology.UPCA,
            Barcode.Symbology.UPCE,
            Barcode.Symbology.CODE128,
            Barcode.Symbology.CODE39,
            Barcode.Symbology.CODE93,
            Barcode.Symbology.INTERLEAVED_2_OF_5
          ],
          codeDuplicateFilter: 1000
        });
        barcodePicker.applyScanSettings(scanSettings);
        barcodePicker.onScan((scanResult) => {
          scanResult.barcodes.reduce((string, barcode) => {
            console.log(string + `${Barcode.Symbology.toHumanizedName(barcode.symbology)}: ${barcode.data}\n`)
            this.item.barcode = barcode.data
            this.loadingItem = true
            this.itemService.retrieveItem(this.item.barcode).subscribe(
              data => {
                console.log('DDD', data)
                this.item.description = data.description
                this.item.priceIn = data.priceIn
                this.item.priceOut = data.priceOut
                this.item.unit = data.unit
                this.item.inStock = data.inStock
                this.loadingItem = false
              }, error => {
                this.item = new Item(undefined, undefined, undefined, undefined, undefined, undefined)
                this.item.barcode = barcode.data
                this.loadingItem = false
              }
            )
            return string + `${Barcode.Symbology.toHumanizedName(barcode.symbology)}: ${barcode.data}\n`
          }, "");
        });
        barcodePicker.onScanError(error => {
          swal({
            "title": "ERROR",
            "text": "Something wrong with the scanner, please refresh the browser!",
            "icon": "error"
          })
          barcodePicker.destroy()
        })
        this.barcodePicker = barcodePicker
      })
    }
  }

  public closeDialog() {
    this.dialogRef.close();
    if (this.barcodePicker != null) {
      this.barcodePicker.destroy()
    }
  }

  createItem() {
    let validateMessage = this.validateItem()
    if (validateMessage === 'ok') {
      this.uploadImage()
    } else {
      swal({
        title: "ERROR",
        text: 'Error: ' + validateMessage,
        icon: "error",
      })
    }
  }

  validateItem(): string {
    if (isNaN(Number(this.item.inStock))) {
      return 'Item instock is not a number'
    }

    if (isNaN(Number(this.item.priceIn)))
      return 'Pricein is not a number'

    if (isNaN(Number(this.item.priceOut)))
      return 'Priceout is not a number'

    if (this.item.barcode == '')
      return 'barcode must be included'

    if (this.filesToUpload === null)
      return "item's image(s) must be included"
    return 'ok'
  }

  handleFileInput(files: FileList) {
    if (files.length > 0) {
      console.log("files length " + files.length)
      this.filesToUpload = new Array<File>()
      for (var i = 0; i < files.length; ++i) {
        let selectedFile = files.item(i)
        let fileName = selectedFile.name
        let extn = fileName.substr(fileName.lastIndexOf('.') + 1);
        if (extn === 'png' || extn === 'jpeg' || extn === 'jpg') {
          this.filesToUpload.push(files.item(i))
        } else {
          break;
        }
      }

      if (this.filesToUpload.length != files.length) {
        swal({
          title: "ERROR",
          text: "Please select .png or .jpeg files",
          icon: "error",
        })
        this.filesToUpload = null
      }
      this.progress.percentage = 0
    }
  }


  uploadImage() {
    this.progress.percentage = 0

    this.itemService.uploadItemImage(this.filesToUpload, this.item.barcode).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total)
      }
    }, error => {
      swal({
        title: "ERROR",
        text: 'Error while uploading file',
        icon: "error",
      })
    },
      () => {
        this.uploadItem()
      })
  }


  uploadItem() {
    // start uploading item
    this.itemService.createItem(this.item).subscribe(
      data => {
        swal({
          title: "SUCCESS",
          text: 'Item created successfully',
          icon: "success",
        })
        this.closeDialog()
      },
      error => {
        swal({
          title: "ERROR",
          text: error.error,
          icon: "error",
        })
      }
    )
  }

  image() {
    console.log("CLICK");
  }

  dosomething() {
    console.log("do something")
  }

  editItem() {
    this.itemService.updateItem(this.item).subscribe(
      data => {
        swal({
          title: "SUCCESS",
          text: 'Item updated successfully',
          icon: "success",
        })
        this.closeDialog()
      }, error => {
        swal({
          title: "ERROR",
          text: error.error,
          icon: "error",
        })
      }
    )
  }

  addToOrder() {
    console.log("Quantity " + this.quantity)
    console.log("Ordercode " + this.orderCode)
    this.loadingItem = true
    if (this.quantity > this.item.inStock) {
      swal({
        title: "ERROR",
        text: "Quantity must be smaller than inStock",
        icon: "error"
      })
      this.loadingItem = false
    } else if (this.quantity === 0) {
      swal({
        title: "ERROR",
        text: "Quantity must be bigger than 0",
        icon: "error"
      })
      this.loadingItem = false
    } else {
      let orderItem = new OrderItem(this.item.barcode, this.orderCode, this.quantity,
        this.item.priceOut, this.item.unit, this.item.description)
      this.orderService.addItem(orderItem).subscribe(
        data => {
          swal({
            title: "SUCCESS",
            text: "Item has been added into order",
            icon: "success"
          })
          this.loadingItem = false
          this.closeDialog()
        }, error => {
          swal({
            title: "ERROR",
            text: error.error,
            icon: "error"
          })
          this.loadingItem = false
        }
      )

    }

  }

  isDisabled() {
    return this.fromOrderDetails === true
  }
}

