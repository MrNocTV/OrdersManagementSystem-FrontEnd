import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Quagga from 'quagga';
import { Item } from '../order/order.component';
import { Barcode, BarcodePicker, ScanSettings, configure } from "scandit-sdk";
import { API_KEY } from '../app.constants';
import { isNumber } from 'util';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  item : Item
  constructor(private dialogRef: MatDialogRef<ItemComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.item = new Item(undefined, undefined, undefined, undefined, undefined, undefined)
    configure(API_KEY, {
      engineLocation: "../../../assets/build"
    });
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
          console.log( string + `${Barcode.Symbology.toHumanizedName(barcode.symbology)}: ${barcode.data}\n`)
          this.item.barcode = barcode.data
          return string + `${Barcode.Symbology.toHumanizedName(barcode.symbology)}: ${barcode.data}\n`
        }, "");
      });

    });
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  playAudio(){
    let audio = new Audio();
    audio.src = "../../../assets/audio/glass.mp3";
    audio.load();
    audio.play();
  }

  createItem() {
    if (!this.validateItem()) {
      alert("Hello Everyone");
    }
  }

  validateItem() {
    return !isNaN(Number(this.item.inStock))
  }
}
