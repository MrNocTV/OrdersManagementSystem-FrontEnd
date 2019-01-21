import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Quagga from 'quagga';
import { Barcode, BarcodePicker, ScanSettings, configure } from "scandit-sdk";
import { API_KEY, API_KEY_PROD, API_URL_PROD } from '../app.constants';
import { isNumber } from 'util';
import swal from 'sweetalert';
import { ItemService } from '../service/data/item.service';
import { Item } from '../list-items/item-datasource';
import { HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  fileToUpload: File = null
  progress: { percentage: number } = { percentage: 0 }
  item: Item
  show: boolean = true
  parentData: Item
  imageURL : string
  constructor(private dialogRef: MatDialogRef<ItemComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private itemService: ItemService) {
    console.log('data from parent', data)
    if (this.data !== null) {
      this.parentData = data.item
      this.show = false
    }
  }

  ngOnInit() {
    this.item = new Item(undefined, undefined, undefined, undefined, undefined, undefined, undefined)
    if (this.parentData !== null && typeof this.parentData !== 'undefined') {
      console.log('data from parent 1', this.parentData)
      this.show = false
      this.item = new Item(this.parentData.barcode, this.parentData.description, this.parentData.priceIn, this.parentData.priceOut, this.parentData.inStock, this.parentData.imagePath, this.parentData.unit)
      this.imageURL = `${API_URL_PROD}/api/items/image/get/${this.item.imagePath}`
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
            return string + `${Barcode.Symbology.toHumanizedName(barcode.symbology)}: ${barcode.data}\n`
          }, "");
        });
      })
    }
  }

  public closeDialog() {
    this.dialogRef.close();
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

    if (this.fileToUpload == null)
      return "item's image must be included"
    return 'ok'
  }

  handleFileInput(files: FileList) {
    if (files.length > 0) {
      let selectedFile = files.item(0)
      let extn = selectedFile.name.split(".").pop()
      if (extn === 'png' || extn === 'jpeg') {
        this.fileToUpload = selectedFile
        this.progress.percentage = 0
      } else {
        swal({
          title: "ERROR",
          text: "Please select .png or .jpeg files",
          icon: "error",
        })
        this.fileToUpload = null
      }
    }
    else {
      this.fileToUpload = null
    }
  }

  uploadImage() {
    this.progress.percentage = 0
    this.itemService.uploadItemImage(this.fileToUpload, this.item.barcode).subscribe(event => {
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
    // set image path to barcode.extension
    let extn = this.fileToUpload.name.split(".").pop()
    let imagePath = this.item.barcode + "." + extn
    this.item.imagePath = imagePath

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
}
