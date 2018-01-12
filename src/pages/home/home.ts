import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Clipboard } from '@ionic-native/clipboard';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  products: any[] = [];
  selectedProduct: any;
  productFoundinDatabase:boolean = false;
  //barcodeResult: string = 'https://www.google.com';
  barcodeResult: string;

  constructor(public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private toast: Toast,
    public dataService: DataServiceProvider,
    public platform: Platform,
    private iab: InAppBrowser,
    private clipboard: Clipboard) {
      this.dataService.getProducts()
        .subscribe((response)=> {
            this.products = response
            console.log(this.products);
        });
  }

  scan() {
    this.selectedProduct = {};
    this.barcodeScanner.scan().then((barcodeData) => {
      this.selectedProduct = this.products.find(product => product.plu === barcodeData.text);
      this.barcodeResult = barcodeData.text;
      if(this.selectedProduct !== undefined) {
        this.productFoundinDatabase = true;
        console.log(this.selectedProduct);
      } else {
        this.selectedProduct = {};
        this.productFoundinDatabase = false;
        /*
        this.toast.show('Product not in database', '5000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
        );
        */
      }
    }, (err) => {
      this.toast.show(err, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
  }

  isCodeURL() {
    var urlTextHTTP, urlTextHTTPS, urlTextWWW: string;
    urlTextHTTP = this.barcodeResult.slice(0, 7);
    urlTextHTTPS = this.barcodeResult.slice(0, 8);
    urlTextWWW = this.barcodeResult.slice(0, 4);
    if(urlTextHTTP == 'http://'){
      return true;
    }
    else if(urlTextHTTPS == 'https://') {
      return true;
    }
    else if(urlTextWWW == 'www.') {
      this.barcodeResult = 'http://' + this.barcodeResult;
      return true;
    }
    else return false;
  }

  openURL(type: string){
    let target = type;
    this.iab.create(this.barcodeResult, target);
  }

  copyText() {
    this.clipboard.copy(this.barcodeResult);
    this.toast.show(`Code Copied!`, '3000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }

}
