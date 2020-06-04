import { Component, OnInit, Input} from '@angular/core';

import { AppComponent } from '../app.component';

// Firestore imports 
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestoreCollectionGroup } from '@angular/fire/firestore';
import { Observable, of, from, Timestamp } from 'rxjs';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';


export interface Agency {
  name: string;
  room: string;
  id: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  agencyCollection: AngularFirestoreCollection<Agency>;
  agencies: Observable<Agency[]>;
  selectedAgency: Agency;

  constructor(private afs: AngularFirestore) { }

  @Input() app: AppComponent;

  ngOnInit(): void {
    this.agencyCollection = this.afs.collection('agencies');
    this.agencies = this.agencyCollection.valueChanges();
	// this.selectedAgency = this.agencies[0];
	console.log(this.agencies);
  }

  successfulLogin() {
    this.app.agency = this.selectedAgency;
	console.log(this.agencies);
	if (this.selectedAgency != null){
		this.app.loginSuccessful = true;
		console.log("valid");
	}
	else{
		this.app.loginSuccessful = false;
		console.log("invalid");
	}
  }

  log(e) {
    console.log(e);
  }
}
