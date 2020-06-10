import { Component, OnInit , Input} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// Firestore imports 
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import {Observable,of, from, Timestamp } from 'rxjs';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { LoginComponent, Agency} from '../login/login.component';
import { AppComponent } from '../app.component';
import { NgForm, NgModel } from '@angular/forms';

// interface that defines the agency visit structure
interface  Visit{
  ID: string;
  code: number;
  time: Timestamp<any>;
}

export interface IDVisit { code: string; visitsNum: number; }
export interface IDVisitID extends IDVisit { id: string; }


@Component({ 
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {

  log(e) {
    console.log(e);
  }

  //QR Code scanner
  scanning: boolean;
  regex: RegExp;

  // Connect Agency to Firebase collection
  // agencyCollection: AngularFirestoreCollection<Visit>;
  // visits : AngularFirestoreCollection<IDVisit>;
  // // visits: Observable<Visit[]>;
  // IDList:Observable<IDVisit[]>;
  AgencyID: string;
  code: string;
  time = firebase.firestore.FieldValue.serverTimestamp();
  groupNumber: number;
  visitsNum = 1 ;
  

  // Group code is today's date YYYYMMDDHHmmss
  // example: Apr 29, 2020 at 4:47:35 PM -> 20200429044735 (12 digits)
  today = new Date();
  dd = String(this.today.getDate()).padStart(2, '0');
  mm = String(this.today.getMonth() + 1).padStart(2, '0'); // January is 0 so add 1
  hh = String(this.today.getHours()).padStart(2, '0');
  min = String(this.today.getMinutes()).padStart(2, '0');
  sec = String(this.today.getSeconds()).padStart(2, '0');
  yyyy = this.today.getFullYear();

  groupCode = parseInt(this.yyyy.toString() + this.mm + this.dd + this.hh + this.min + this.sec);

  @Input() agency: Agency; // Here is a reference to the current agency that is logged in. Properties: name, id ( collection ) , room  

  constructor(private afs: AngularFirestore, private _snackBar: MatSnackBar) {
    this.regex = /\d{1,5}/;
  }

  ngOnInit() {
  }

  addSingleVisit() {
	if (this.code != null && this.code != ""){
		this.afs.collection(this.code.toString() + "d").add({ 'AgencyID': this.agency.id, 'code': this.code + "d", 'Time': this.time });
		this.showSnackBar("Visit " + this.code + " logged successfully", "OK", 3000);
		this.afs.collection("visits").doc(this.code.toString() + "d").set({'code': this.code.toString() + "d"});

		// save all IDs in a collection
		this.afs.collection("visits").valueChanges().subscribe(val => console.log(val));
	}
  }

  addGroupVisit(){
	if (this.groupNumber != null && this.groupNumber != 0){
      for (var _i = 0; _i < this.groupNumber; _i++) {
        this.afs.collection((this.groupCode + _i).toString() + "d").add({ 'AgencyID': this.agency.id, 'code': (this.groupCode + _i).toString() + "d", 'Time': this.time });
		//this.afs.collection(this.groupCode.toString() + "d").add({ 'AgencyID': this.agency.id, 'code': this.groupCode.toString() + "d", 'Time': this.time });
        this.afs.collection("visits").doc(this.groupCode.toString() + "d").set({'code': this.groupCode.toString() + "d"});
      // save all IDs in a collection
        this.afs.collection("visits").valueChanges().subscribe(val => console.log(val));
      }
      this.showSnackBar("Event with " + this.groupNumber + " guests logged successfully", "OK", 3000);
	}
	this.groupCode = this.groupCode + (this.groupNumber + 1);
  }

  scanSuccessHandler(event) {
    this.code = event;
    if (this.code.match(this.regex)) {
      this.addSingleVisit();
      this.showSnackBar("Visit " + this.code + " logged successfully", "OK", 3000);
      this.stopScan();
    }
    else {
      this.showSnackBar("QR Code is not the correct format. Try Again", "Okay", 3000);
    }
    this.clearForms();
  }

  showSnackBar(message, action, time) {
    this._snackBar.open(message, action, { duration: time });
  }

  clearForms() {
    this.code = null;
    this.groupNumber = null;
  }

  startScan() {
    this.scanning = true;
  }

  stopScan() {
    this.scanning = false;
  }
}
