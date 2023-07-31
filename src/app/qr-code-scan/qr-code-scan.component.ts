import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeResult,
  NgxScannerQrcodeService,
  NgxScannerQrcodeComponent,
  ScannerQRCodeSelectedFiles,
} from 'ngx-scanner-qrcode';
import {Router} from "@angular/router";

@Component({
  selector: 'app-qr-code-scan',
  templateUrl: './qr-code-scan.component.html',
  styleUrls: ['./qr-code-scan.component.scss']
})

export class QrCodeScanComponent implements OnInit,OnDestroy {
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#front_and_back_camera
  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth
      },
    },
    canvasStyles: [
      { /* layer */
        lineWidth: 1,
        fillStyle: '#00950685',
        strokeStyle: '#00950685',
      },
      { /* text */
        font: '17px serif',
        fillStyle: '#ff0000',
        strokeStyle: '#ff0000',
      }
    ],
  };
  qr_string= '';
  invoice_data:any[] = [];

  @ViewChild('action') action!: NgxScannerQrcodeComponent;

  constructor(private qrcode: NgxScannerQrcodeService,
              private router: Router
  ) {
  }

  ngOnInit() {
    const myButton = document.getElementById('camera_button');
    if (myButton) myButton.click();
  }
  ngOnDestroy() {
   location.reload();
  }

  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    // console.log(e);

    if(e){
      this.qr_string = e[0]['value'];
      const retrievedArrayJSON = sessionStorage.getItem('invoice_data');
      if(retrievedArrayJSON){
        this.invoice_data = JSON.parse(retrievedArrayJSON);
        // console.log("here get item from session storage", this.invoice_data);
      }
      let amount = 0, count = 0;
      if (this.qr_string) {
        let n = this.qr_string.length;
        for (let i = n - 1; i >= 0; i--) {
          const charCode = this.qr_string.charCodeAt(i);
          if (this.qr_string[i] == ' ' && amount != 0) {
            this.qr_string = this.qr_string.slice(0, i);
            break;
          }
          if (charCode >= 48 && charCode <= 57) {
            amount += (+this.qr_string[i]) * Math.pow(10, count);
            count++;
          }
        }
      }
      let last= this.invoice_data.length - 1;
      if(last>=0 && this.invoice_data[last].product_price==null) this.invoice_data.pop();
      this.invoice_data.push(
        {
          product_name: this.qr_string,
          product_mrp: amount,
          product_price: amount,
        }
      );
      const arrayJSON = JSON.stringify(this.invoice_data);
      sessionStorage.setItem('invoice_data', arrayJSON);
      this.router.navigateByUrl('main_page');
    }

  }

  public handle(action: any, fn: string): void {
    // Fix issue #27, #29
    const playDeviceFacingBack = (devices: any[]) => {
      // front camera or back camera check here!
      const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    }

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
    } else {
      action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
  }
}
