import { Component, OnInit } from '@angular/core';

// Firestore imports 
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import {Observable,of, from, Timestamp } from 'rxjs';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { NgForm, NgModel } from '@angular/forms';



interface  Visit{
  code: number;
}
// interface that defines the agency visit structure
interface  AencyVisit{
  ID: string;
  code: string;
  time: Timestamp<any>;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

   // Connect Agency to Firebase collection
   visitCollection: AngularFirestoreCollection<Visit>;
   visits: Observable<Visit[]>;
   totalNumVisits = 0;
   agencyCounter=0;
   counterArray ={1:0, 2:0 , 3:0}; //  key represents duplicate or triplit of agencies, value = their number
   mostCommonPair = {};
   mostCommonTriplet = {};

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.getStatistics();
    
  }

  getStatistics(): void{
    const visitArray = this.afs.collection("visits").snapshotChanges();
    visitArray.subscribe( payload => {
      payload.forEach( item => {
        const visitID = item.payload.doc.data() as Visit;
        console.log("visitID", visitID.code);

        
        // getting visited Agenccies
        const visitedAgencies = this.afs.collection(visitID.code.toString()).snapshotChanges();
        visitedAgencies.subscribe( payload => {
          payload.forEach( item => {
            this.totalNumVisits+=1;
            this.agencyCounter+=1;
            const agencyVisit = item.payload.doc.data() as AencyVisit; 
            console.log("agencyVisit", agencyVisit);
           
            
          });
          console.log(this.counterArray[this.agencyCounter]+=1,"visit for ", this.agencyCounter , "agencies" );
          this.counterArray[this.agencyCounter]+=1;
          this.agencyCounter =0;
      });
    });
  });

  console.log(this.counterArray[1] , " visit for " , 1 , "agencies");
  console.log(this.counterArray[2] , " visit for " , 2 , "agencies");
  console.log(this.counterArray[3] , " visit for " , 3 , "agencies");

 }
}
