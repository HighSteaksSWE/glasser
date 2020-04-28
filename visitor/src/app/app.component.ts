import { Component } from '@angular/core';
import { Agency } from "./login/login.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'visitor';
  loginSuccessful: boolean = false;
  agency: Agency;
}
