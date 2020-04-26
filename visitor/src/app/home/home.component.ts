import { Component, OnInit } from '@angular/core';

// Firestore imports 
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {Observable,of, from, Timestamp } from 'rxjs';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';


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

  // Connect Agency to Firebase collection
  agencyCollection: AngularFirestoreCollection<Visit>;
  visits: Observable<Visit[]>;
  ID = 'A4'
  code: number;
  time = firebase.firestore.FieldValue.serverTimestamp();


  constructor(private afs: AngularFirestore) {}

  ngOnInit() {
    this.agencyCollection = this.afs.collection('Agency1');
    this.visits = this.agencyCollection.valueChanges();
  }

  addVisit() {
    this.afs.collection('Agency1').add({'ID':this.ID, 'code': this.code, 'Time': this.time});
  }

}
