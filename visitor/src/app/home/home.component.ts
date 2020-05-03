import { Component, OnInit , Input} from '@angular/core';
import { MatSnackBarModule, SimpleSnackBar, MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

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

  // Connect Agency to Firebase collection
  agencyCollection: AngularFirestoreCollection<Visit>;
  visits: Observable<Visit[]>;
  AgencyID: string;
  code: string;
  time = firebase.firestore.FieldValue.serverTimestamp();
  groupNumber: number;

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

  constructor(private afs: AngularFirestore) {}

  ngOnInit() {
    this.agencyCollection = this.afs.collection('Agency1');
    this.visits = this.agencyCollection.valueChanges();
    console.log(this.agency);
  }

  addSingleVisit() {
    this.afs.collection(this.code.toString() + "d").add({ 'AgencyID': this.agency.id, 'code': this.code + "d", 'Time': this.time });
  }

  addGroupVisit(){
      for (var _i = 0; _i < this.groupNumber; _i++) {
        this.afs.collection(this.groupCode.toString() + "d").add({ 'AgencyID': this.agency.id, 'code': this.groupCode.toString() + "d", 'Time': this.time });
    }
  }

  scanSuccessHandler(event) {
    this.code = event;
  }

  startScan() {
    this.scanning = true;
  }

  stopScan() {
    this.scanning = false;
  }
}
