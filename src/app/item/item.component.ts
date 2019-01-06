import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Quagga from 'quagga';
import { Item } from '../order/order.component';
import { Barcode, BarcodePicker, ScanSettings, configure } from "scandit-sdk";
import { API_KEY } from '../app.constants';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  item : Item
  constructor(private dialogRef: MatDialogRef<ItemComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.item = new Item(undefined)
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
          this.item.code = barcode.data
          return string + `${Barcode.Symbology.toHumanizedName(barcode.symbology)}: ${barcode.data}\n`
        }, "");
      });

    });
    // Quagga.init({
    //   inputStream: {
    //     name: "Live",
    //     type: "LiveStream"
    //   },
    //   decoder: {
    //     readers: ["ean_reader"]
    //   }
    // }, function () {
    //   console.log("Initialization finished. Ready to start");
    //   Quagga.start();
    // });

    // Quagga.onDetected(data => {
    //   let detectedCode = data.codeResult.code
    //   if (detectedCode != null && detectedCode != '' && detectedCode != undefined) {
    //     if(this.item.code == undefined) {
    //       this.item.code = detectedCode
    //       console.log("Detected ",detectedCode, "!");
    //       this.playAudio()
    //     }
    //   }
    // })
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
}
