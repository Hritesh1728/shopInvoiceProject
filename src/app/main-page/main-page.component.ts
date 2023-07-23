import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";



@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit{
  invoice_data: any[] = [];
  // total_form_fields = this.invoice_data.length;
  currentDate = new Date();
  total_price = 0;
  total_mrp = 0;
  open_invoice = false;


  constructor(
    private router: Router,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit() {
    // Initialization logic goes here
  }

  openDialog(addManually: TemplateRef<any>) {
    this.invoice_data.push({
      product_name: '',
      product_mrp: 0,
      product_price: 0,
    });
    this.open_invoice = false;
    this.modalService.open(addManually, {centered: true, backdrop: 'static', animation: true});
  }

  increment_table() {
    let last = this.invoice_data.length - 1;
    this.total_price+=this.invoice_data[last].product_price;
    this.total_mrp+=this.invoice_data[last].product_mrp;
    this.invoice_data.push({
      product_name: '',
      product_mrp: 0,
      product_price: 0,
    });
  }

  manual_data_submit() {
    let last = this.invoice_data.length - 1;
    this.total_price+=this.invoice_data[last].product_price;
    this.total_mrp+=this.invoice_data[last].product_mrp;
    this.modalService.dismissAll();
  }

  less_mrp() {
    let last = this.invoice_data.length - 1;
    this.invoice_data[last].product_price = this.invoice_data[last].product_mrp * 0.8;
  }

  fix_mrp() {
    let last = this.invoice_data.length - 1;
    this.invoice_data[last].product_price = this.invoice_data[last].product_mrp;
  }

  manual_data_reset() {
    this.invoice_data = [{
      product_name: '',
      product_mrp: 0,
      product_price: 0,
    }];
  }


  openInvoice() {
    this.open_invoice = true;
  }
}
