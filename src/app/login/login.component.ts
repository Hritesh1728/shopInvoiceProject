import { Component } from '@angular/core';
import {Router} from "@angular/router";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username='';
  password ='';
  constructor(
    private router: Router,
  ) {}


  submit() {
    if(this.username==='9413991728' && this.password==='Shop@GG'){
      this.router.navigateByUrl(`main_page`);
    }else{

    }
  }
}
