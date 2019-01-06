import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Quagga from 'quagga';
import { Item } from '../order/order.component';

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

    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream"
      },
      decoder: {
        readers: ["upc_e_reader", "upc_reader"]
      }
    }, function () {
      console.log("Initialization finished. Ready to start");
      Quagga.start();
    });

    Quagga.onDetected(data => {
      let detectedCode = data.codeResult.code
      if (detectedCode != null && detectedCode != '' && detectedCode != undefined) {
        if(this.item.code == undefined) {
          this.item.code = detectedCode
          console.log("Detected ",detectedCode, "!");
          this.playAudio()
        }
      }
    })
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
