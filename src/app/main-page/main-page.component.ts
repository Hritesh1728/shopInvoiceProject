import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})

export class MainPageComponent implements OnInit {
  invoice_data: any[] = [];
  // total_form_fields = this.invoice_data.length;
  currentDate = new Date();
  less_factor = 20;
  less_initiated = false;
  del_index: number | null = null;
  del_item_initiated = false;

  total_price = 0;
  total_save_price = 0;
  open_invoice = false;
  random3DigitNumber = 0;
  status_of_payment = 'Un-Paid';
  paid_amount = 0;
  remarked = false;
  whatsapp_no = '';


  constructor(
    private router: Router,
    private modalService: NgbModal,
    private offCanvas: NgbOffcanvas,
  ) {
  }

  ngOnInit() {
    const retrievedArrayJSON = sessionStorage.getItem('invoice_data');
    if (retrievedArrayJSON) {
      this.invoice_data = JSON.parse(retrievedArrayJSON);
      for (let i = 0; i < this.invoice_data.length; i++) {
        this.total_price += this.invoice_data[i].product_price;
        this.total_save_price += (this.invoice_data[i].product_mrp - this.invoice_data[i].product_price);
      }
    }
  }


  openDialog(addManually: TemplateRef<any>) {
    let last = this.invoice_data.length - 1;
    if (last == -1) {
      this.invoice_data.push({
        product_name: '',
        product_mrp: null,
        product_price: null,
      });
    }
    this.open_invoice = false;
    this.modalService.open(addManually, {centered: true, backdrop: 'static', animation: true});
  }

  transaction_content(panContent: TemplateRef<any>) {
    this.offCanvas.open(panContent, {position: 'end', backdrop: 'static'});
  }

  about_content(about_me: TemplateRef<any>) {
    this.offCanvas.open(about_me, {position: 'end', backdrop: 'static'});
  }

  share_invoice(whatsapp: TemplateRef<any>) {
    this.offCanvas.open(whatsapp, {position: 'end', backdrop: 'static'});
  }

  increment_table() {
    let last = this.invoice_data.length - 1;
    if (last == -1) {
      this.invoice_data.push({
        product_name: '',
        product_mrp: null,
        product_price: null,
      });
    } else if (this.invoice_data[last].product_price != null) {
      this.invoice_data.push({
        product_name: '',
        product_mrp: null,
        product_price: null,
      });
    }
    this.del_item_initiated = false;
  }

  manual_data_submit() {
    this.modalService.dismissAll();
  }

  fix_mrp() {
    let last = this.invoice_data.length - 1;
    this.invoice_data[last].product_price = +(this.invoice_data[last].product_mrp).toFixed(2);
    this.total_price += this.invoice_data[last].product_price;
    this.total_save_price += (this.invoice_data[last].product_mrp - this.invoice_data[last].product_price);
    this.del_item_initiated = false;
  }

  less_mrp() {
    let last = this.invoice_data.length - 1;
    this.less_initiated = false;
    if (this.less_factor != null && this.less_factor > 0) {
      this.less_factor = 1 - (+(this.less_factor / 100).toFixed(2));
      this.invoice_data[last].product_price = +(this.invoice_data[last].product_mrp * this.less_factor).toFixed(2);
      this.total_price += this.invoice_data[last].product_price;
      this.total_save_price += (this.invoice_data[last].product_mrp - this.invoice_data[last].product_price);
    }
    this.less_factor = 20;
    this.del_item_initiated = false;
  }

  manual_data_reset() {
    this.invoice_data = [];
    this.total_price = 0;
    this.total_save_price = 0;
    this.del_item_initiated = false;
    this.remarked = false;
    sessionStorage.clear();
  }


  openInvoice() {
    this.total_save_price = +this.total_save_price.toFixed(2);
    this.random3DigitNumber = Math.floor(100 + Math.random() * 900);
    let last = this.invoice_data.length - 1;
    if(last != -1){
      if(this.invoice_data[last].product_price==null) this.invoice_data.pop();
    }
    this.open_invoice = true;
  }

  remove_item() {
    this.del_item_initiated = false;
    if (this.del_index != null && this.del_index > 0) {
      this.total_price -= this.invoice_data[this.del_index - 1].product_price;
      this.total_save_price -= (this.invoice_data[this.del_index - 1].product_mrp - this.invoice_data[this.del_index - 1].product_price);
      this.invoice_data.splice(this.del_index - 1, 1);
    }
    this.del_index = null;
  }

  openQrScan() {
    const arrayJSON = JSON.stringify(this.invoice_data);
    sessionStorage.setItem('invoice_data', arrayJSON);
    this.router.navigateByUrl(`qr_scanner`);
  }

  protected readonly location = location;

  whatsapp_invoice() {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit', // 'dd' for two-digit day
      month: '2-digit', // 'MM' for two-digit month
      year: 'numeric' // 'yyyy' for full year
    };
    let return_price = +((this.paid_amount - this.total_price) >= 0 ? (this.paid_amount - this.total_price) : 0).toFixed(2);
    const formattedDate: string = this.currentDate.toLocaleDateString(undefined, options);
    let url_string = '?text=->%20%20%20%20%20%20%20%20*Invoice*%0D%0A' +
      '%20%20*Token%20%20%20%20%20=%20%20%20%20%20' + this.random3DigitNumber.toString() + '*%0D%0A' +
      '%20%20Date%20%20%20%20%20%20%20=%20%20%20%20%20' + formattedDate + '%0D%0A' +
      '%20%20----------------------------------%0D%0A';
    for (let i = 0; i < this.invoice_data.length; i++) {
      let spaces = 30 - (this.invoice_data[i].product_name.length - 1) * 2;
      url_string += '%20%20' + this.invoice_data[i].product_name;
      for (let j = 0; j < spaces; j++) url_string += '%20';
      url_string += this.invoice_data[i].product_mrp.toString() + '%20%20%20%20' + this.invoice_data[i].product_price.toString() + '%0D%0A';
    }
    url_string += '%20%20----------------------------------%0D%0A' +
      '%20%20Total+Price%20%20%20%20%20=%20%20%20%20%20' + this.total_price.toString() + '%0D%0A' +
      '%20%20Saved+Price%20%20%20%20%20=%20%20%20%20%20' + this.total_save_price.toString() + '%0D%0A';
    if (this.status_of_payment == 'Paid') {
      url_string += '%20%20Status%20%20%20%20%20=%20%20%20%20%20' + this.status_of_payment + '%0D%0A' +
        '%20%20Customer+Paid%20%20%20%20%20=%20%20%20%20%20' + (+this.paid_amount).toString() + '%0D%0A' +
        '%20%20~Return~%20%20%20%20%20=%20%20%20%20%20' + return_price + '%0D%0A' +
        '%20%20Thank+you+for+Shopping+with+us%20%20%20%20%20%20%20%20%20%20';
    } else {
      url_string += '%20%20Status%20%20%20%20%20=%20%20%20%20%20' + this.status_of_payment + '%0D%0A' +
        '%20%20Thank+you+for+Shopping+with+us%20%20%20%20%20%20%20%20%20%20';
    }
    window.open('https://wa.me/91' + this.whatsapp_no + url_string, '_blank');
  }
}


