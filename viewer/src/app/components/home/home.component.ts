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
   agencyList = new Array(); 

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

        
        // getting visited frequencies
        const visitedAgencies = this.afs.collection(visitID.code.toString()).snapshotChanges();
        visitedAgencies.subscribe( payload => {
          payload.forEach( item => {
            this.totalNumVisits+=1;
            this.agencyCounter+=1;
            const agencyVisit = item.payload.doc.data() as AencyVisit; 
            this.agencyList.push(agencyVisit.ID);
            //console.log("agencyVisit", agencyVisit);          
            
          });
          //console.log(this.counterArray[this.agencyCounter]+=1,"visit for ", this.agencyCounter , "agencies" );
          this.counterArray[this.agencyCounter]+=1;

          // getting visited Agenccies based on the agencyCounter
          for(var i = 0;i<this.agencyList.length;i++) { 
            if (this.agencyCounter == 2) {
              this.mostCommonPair[this.agencyList[i]] +=1;
            } else if (this.agencyCounter == 3){
              this.mostCommonTriplet[this.agencyList[i]] +=1; 
            }
          }

          this.agencyCounter =0;
          //empty the array
          this.agencyList.length = 0;
      });
    });
  });
  
  console.log(this.counterArray[1] , " visit for " , 1 , "agencies");
  console.log(this.counterArray[2] , " visit for " , 2 , "agencies");
  console.log(this.counterArray[3] , " visit for " , 3 , "agencies");
  console.log("this.mostCommonTriplet", this.mostCommonTriplet);
  console.log("this.mostCommonPair", this.mostCommonPair);

 }
}
