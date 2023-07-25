import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";



@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  invoice_data: any[] = [];
  // total_form_fields = this.invoice_data.length;
  currentDate = new Date();

  less_factor=20;
  less_initiated =false ;
  del_index: number | null = null;
  del_item_initiated = false;

  total_price = 0;
  total_save_price = 0;
  open_invoice = false;
  random4DigitNumber = 0;



  constructor(
    private router: Router,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit() {
    // Initialization logic goes here
    console.log(this.invoice_data.length)
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
  }

  manual_data_submit() {
    this.modalService.dismissAll();
  }

  fix_mrp() {
    let last = this.invoice_data.length - 1;
    this.invoice_data[last].product_price = +(this.invoice_data[last].product_mrp).toFixed(2);
    this.total_price += this.invoice_data[last].product_price;
    this.total_save_price += (this.invoice_data[last].product_mrp - this.invoice_data[last].product_price);
  }

  less_mrp() {
    let last = this.invoice_data.length - 1;
    this.less_initiated = false;
    if (this.less_factor != null && this.less_factor > 0) {
      this.less_factor = 1-(+(this.less_factor/100).toFixed(2));
      this.invoice_data[last].product_price = +(this.invoice_data[last].product_mrp * this.less_factor).toFixed(2);
      this.total_price += this.invoice_data[last].product_price;
      this.total_save_price += (this.invoice_data[last].product_mrp - this.invoice_data[last].product_price);
    }
    this.less_factor =20;
  }

  manual_data_reset() {
    this.invoice_data = [];
    this.total_price = 0;
    this.total_save_price = 0;
  }


  openInvoice() {
    this.total_save_price = +this.total_save_price.toFixed(2);
    this.random4DigitNumber = Math.floor(1000 + Math.random() * 9000);
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
    this.router.navigateByUrl(`qr_scanner`);
  }
}
