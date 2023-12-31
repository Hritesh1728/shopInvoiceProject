import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import {FormsModule} from "@angular/forms";
import { MainPageComponent } from './main-page/main-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from "@angular/material/button";
import { QrCodeScanComponent } from './qr-code-scan/qr-code-scan.component';
import {NgxScannerQrcodeModule} from "ngx-scanner-qrcode";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainPageComponent,
    QrCodeScanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    NgxScannerQrcodeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
