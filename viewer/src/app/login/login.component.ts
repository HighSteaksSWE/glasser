import { Component, OnInit, Input } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() app: AppComponent;

  successfulLogin() {
    this.app.loginSuccessful = true;
    //console.log("logging tf in");
  }

  log(e) {
    console.log(e);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
