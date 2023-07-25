import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {MainPageComponent} from "./main-page/main-page.component";
import {QrCodeScanComponent} from "./qr-code-scan/qr-code-scan.component";

const routes: Routes = [
  {path:'', component: LoginComponent},
  {path:'main_page', component: MainPageComponent},
  {path:'qr_scanner', component: QrCodeScanComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
