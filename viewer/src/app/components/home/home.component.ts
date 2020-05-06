import { Component, OnInit } from '@angular/core';

// Firestore imports 
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import {Observable,of, from, Timestamp } from 'rxjs';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
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
export class HomeComponent implements OnInit {

   // Connect Agency to Firebase collection
   agencyCollection: AngularFirestoreCollection<Visit>;
   visits: Observable<Visit[]>;
   AgencyID: string;
   code: string;
   time = firebase.firestore.FieldValue.serverTimestamp();
   groupNumber: number;
   size:number;
 

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    
  }

}
